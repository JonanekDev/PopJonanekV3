import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { hash } from 'bcrypt';
import { randomBytes } from 'crypto';
import * as fs from 'fs';
import { join } from 'path';
import { mailCodes } from './entities/mailcodes.entity';
import { DataSource } from 'typeorm';
import { users } from 'src/users/entities/users.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private mailRepository;
  constructor(
    private dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {
    this.mailRepository = this.dataSource.getRepository(mailCodes);
  }

  getTransporter() {
    return nodemailer.createTransport({
      host: this.configService.get<string>('smtp.host'),
      port: this.configService.get<number>('smtp.port'),
      secure: this.configService.get<boolean>('smtp.tls'),
      auth: {
        user: this.configService.get<string>('smtp.user'),
        pass: this.configService.get<string>('smtp.password'),
      },
    });
  }

  async getTemplate(template: string) {
    const templateDir = join(__dirname, '..', 'mailtemplates');
    const path = `${templateDir}/${template}.html`;

    const html = fs.promises.readFile(path, 'utf8');

    return html;
  }

  async sendMail(type: 'verify' | 'reset', user: users): Promise<void> {
    const token = await this.createToken(user.userId, type);
    const transporter = this.getTransporter();
    const html = await this.getTemplate(type);

    await transporter.sendMail({
      from: this.configService.get<boolean>('mail.from'),
      to: user.email,
      subject:
        '[POPJONANEK]' + type === 'verify'
          ? 'Ověření emailu'
          : 'Žádost o resetování hesla',
      html: html.replace('[TOKEN]', token).replace('[USERNAME]', user.username), //TODO: přidat do emailu IP
    });
  }

  async createToken(userId: number, type: 'verify' | 'reset'): Promise<string> {
    let token: string;
    let tokenExists: boolean;

    //Generování tokenu (kontrola zda stejný již neexistuje)
    do {
      token = randomBytes(
        this.configService.get<number>('mail.tokenLength'),
      ).toString('hex');
      tokenExists = await this.mailRepository.findOne({
        where: { token: token },
      });
    } while (tokenExists);

    const hashedToken = await hash(
      token,
      this.configService.get<number>('password.hashSaltRounds'),
    );

    const mailCode = await this.mailRepository.create({
      userId: userId,
      type: type == 'verify' ? 0 : 1,
      token: hashedToken,
      expiration: new Date(
        Date.now() +
          1000 * 60 * this.configService.get<number>('mail.tokenExpiresIn'),
      ),
    });
    await this.mailRepository.save(mailCode);
    return token;
  }
}
