import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { hash, compare } from 'bcrypt';

import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgotpasssword.dto';
import { MailService } from 'src/mail/mail.service';
import { User } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EmailVerifyDto } from './dto/emailverify.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
    private configService: ConfigService,
  ) {}

  async validateUser(userId: number): Promise<User> {
    return await this.usersService.getUserById(userId);
  }

  async registerUser(registerdto: RegisterDto): Promise<User> {
    const emailExists = await this.usersService.checkEmail(registerdto.email);
    if (emailExists) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          error: 'Uživatel s tímto emailem již existuj',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashedPassword = await hash(
      registerdto.password,
      this.configService.get<number>('password.hashSaltRounds'),
    );
    let newUser;
    try {
      newUser = await this.usersService.createUser({
        username: registerdto.username,
        email: registerdto.email,
        password: hashedPassword,
      });
    } catch (err) {
      throw err;
    }
    this.mailService.sendMail('verify', newUser);
    const authToken = this.jwtService.sign({ userId: newUser.userId });
    newUser.authToken = authToken;
    return newUser;
  }

  async loginUser(loginDto: LoginDto): Promise<User> {
    const user = await this.usersService.getUserByEmail(loginDto.email);
    const passwordCheck = await compare(loginDto.password, user.password);
    if (!user || !passwordCheck) {
      throw new HttpException(
        {
          statusCode: HttpStatus.UNAUTHORIZED,
          error: 'Špatný email nebo heslo',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    user.lastLogDate = new Date();
    await this.usersService.updateUser(user);
    const authToken = this.jwtService.sign({ userId: user.userId });
    user.authToken = authToken;
    return user;
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    const user = await this.usersService.getUserByEmail(
      forgotPasswordDto.email,
    );
    if (!user) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          error: 'Uživatel s takovým emailem neexistuje',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    await this.mailService.sendMail('reset', user);
  }

  async resendEmailVerify(userId: number): Promise<void> {
    const user = await this.usersService.getUserById(userId);
    if (user.verified) {
      throw new HttpException(
        { statusCode: HttpStatus.BAD_REQUEST, error: 'Email je již ověřen' },
        HttpStatus.BAD_REQUEST,
      );
    }
    this.mailService.sendMail('verify', user);
  }

  async emailVerify(emailVerifyDto: EmailVerifyDto): Promise<void> {
    const mailCode = await this.mailService.verifyToken(emailVerifyDto.token);
    if (!mailCode) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          error: 'Neplatný ověřovací token',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = await this.usersService.getUserById(mailCode.userId);
    user.verified = true;
    await this.usersService.updateUser(user);
  }
}
