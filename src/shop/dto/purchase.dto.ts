import { IsNotEmpty } from 'class-validator';

export class PurchaseDto {
  @IsNotEmpty()
  chestId: number;
}
