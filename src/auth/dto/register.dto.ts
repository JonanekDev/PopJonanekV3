import { IsEmail, Length, Matches } from 'class-validator';

export class RegisterDto {
  @Length(5, 30)
  username: string;

  @IsEmail()
  email: string;

  @Length(8, 50)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    { message: 'Heslo je příliš jednoduché' },
  )
  password: string;
}
