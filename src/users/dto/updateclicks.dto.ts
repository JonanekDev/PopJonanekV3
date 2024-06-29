import { IsNotEmpty } from 'class-validator';

export class UpdateClicksDto {
  @IsNotEmpty()
  clicks: number;
}
