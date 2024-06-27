import { users } from 'src/users/users.entity';

export interface ResDto {
  status: 'ok' | 'error';
  errCodes?: number[];
  data?: null | users | users[] | [];
}
