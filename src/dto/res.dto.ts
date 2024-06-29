import { users } from 'src/users/entities/users.entity';

export interface ResDto {
  status: 'ok' | 'error';
  errCodes?: number[];
  data?: null | users | users[] | number;
}
