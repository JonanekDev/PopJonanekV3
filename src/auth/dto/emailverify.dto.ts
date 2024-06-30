import { IsNotEmpty } from 'class-validator';

export class EmailVerifyDto {
  @IsNotEmpty()
  token: string;
}
