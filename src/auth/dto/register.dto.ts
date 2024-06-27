import { IsEmail, Length, Matches } from 'class-validator';

export class RegisterDto {
  @Length(
    Number(process.env.USERNAME_MIN_LENGTH) || 8,
    Number(process.env.USERNAME_MAX_LENGTH) || 50,
  )
  username: string;

  @IsEmail()
  email: string;

  @Length(
    Number(process.env.PASSWORD_MIN_LENGTH) || 8,
    Number(process.env.PASSWORD_MAX_LENGTH) || 50,
  )
  @Matches(
    RegExp(process.env.PASSWORD_REGEX) ||
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    {
      message: 'Heslo je příliš jednoduché',
    },
  )
  password: string;
}
