import { IsNotEmpty } from 'class-validator';

export class UseItemDto {
  @IsNotEmpty()
  inventoryId: number;
}
