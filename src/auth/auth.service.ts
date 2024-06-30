import { Injectable } from '@nestjs/common';
import { hash, compare } from 'bcrypt';

import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import { ResDto } from 'src/dto/res.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgotpasssword.dto';
import { MailService } from 'src/mail/mail.service';
import { users } from 'src/users/entities/users.entity';
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

  async validateUser(userId: number): Promise<users> {
    return await this.usersService.getUserById(userId);
  }

  async registerUser(registerdto: RegisterDto): Promise<ResDto> {
    const errCodes: number[] = [];

    const emailExists = await this.usersService.checkEmail(registerdto.email);
    if (emailExists) {
      errCodes.push(1);
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
        regDate: new Date(),
        lastLogDate: new Date(),
      });
    } catch (error) {
      errCodes.push(2);
    }
    if (errCodes.length > 0) {
      return {
        status: 'error',
        errCodes,
      };
    }
    this.mailService.sendMail('verify', newUser);
    const authToken = this.jwtService.sign({ userId: newUser.userId });
    newUser.authToken = authToken;
    return {
      status: 'ok',
      data: newUser,
    };
  }

  async loginUser(loginDto: LoginDto): Promise<ResDto> {
    const user = await this.usersService.getUserByEmail(loginDto.email);
    if (!user) {
      return {
        status: 'error',
        errCodes: [3],
      };
    }
    const passwordCheck = await compare(loginDto.password, user.password);
    if (!passwordCheck) {
      return {
        status: 'error',
        errCodes: [4],
      };
    }
    const authToken = this.jwtService.sign({ userId: user.userId });
    user.authToken = authToken;
    return {
      status: 'ok',
      data: user,
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<ResDto> {
    const user = await this.usersService.getUserByEmail(
      forgotPasswordDto.email,
    );
    if (!user) {
      return {
        status: 'error',
        errCodes: [3],
      };
    }
    await this.mailService.sendMail('reset', user);
    return {
      status: 'ok',
    };
  }

  async resendEmailVerify(userId: number): Promise<ResDto> {
    const user = await this.usersService.getUserById(userId);
    if (user.verified) {
      return {
        status: 'error',
        errCodes: [9],
      };
    }
    this.mailService.sendMail('verify', user);
    return null;
  }

  async emailVerify(emailVerifyDto: EmailVerifyDto): Promise<ResDto> {
    const mailCode = await this.mailService.verifyToken(emailVerifyDto.token);
    if (!mailCode) {
      return {
        status: 'error',
        errCodes: [8],
      };
    }
    const user = await this.usersService.getUserById(mailCode.userId);
    user.verified = true;
    await this.usersService.updateUser(user);
    return {
      status: 'ok',
    };
  }
}
