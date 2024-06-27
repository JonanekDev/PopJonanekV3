import { Inject, Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { HashedPasswordDto } from './dto/hashedpassword.dto';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import { ResDto } from 'src/dto/res.dto';

@Injectable()
export class AuthService {
  @Inject(UsersService)
  private readonly usersService: UsersService;

  async registerUser(registerdto: RegisterDto): Promise<ResDto> {
    const errCodes: number[] = [];

    const emailExists = await this.usersService.checkEmail(registerdto.email);
    if (emailExists) {
      errCodes.push(1);
    }

    const hashedPassword = await this.hashPassword(registerdto.password);
    let newUser;
    try {
      newUser = await this.usersService.createUser({
        username: registerdto.username,
        email: registerdto.email,
        password: hashedPassword.passwordHash,
        passwordSalt: hashedPassword.salt,
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
    return {
      status: 'ok',
      data: newUser,
    };
  }

  async hashPassword(
    password: string,
    salt?: string,
  ): Promise<HashedPasswordDto> {
    if (!salt) {
      salt = await bcrypt.genSalt();
    }
    return {
      salt,
      passwordHash: await bcrypt.hash(password, salt),
    };
  }
}
