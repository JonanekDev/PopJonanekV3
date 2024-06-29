import { ConfigService } from '@nestjs/config';
import { IsEmail, Length, Matches } from 'class-validator';

const configService = new ConfigService();

export class RegisterDto {
  @Length(configService.get('username.min'), configService.get('username.max'))
  username: string;

  @IsEmail()
  email: string;

  @Length(configService.get('password.min'), configService.get('password.max'))
  @Matches(configService.get<RegExp>('password.regex'), {
    message: 'Heslo je příliš jednoduché',
  })
  password: string;
}
