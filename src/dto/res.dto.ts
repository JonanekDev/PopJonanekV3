import { HttpStatus } from '@nestjs/common';
import { Item } from 'src/shop/entitities/item.entity';
import { User } from 'src/users/entities/user.entity';

export interface ResDto {
  statusCode: HttpStatus;
  message?: string;
  data?: null | User | User[] | number | Item;
}
