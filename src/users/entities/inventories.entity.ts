import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { users } from './users.entity';
import { items } from 'src/shop/entitities/items.entity';

@Entity()
export class inventories {
  @PrimaryGeneratedColumn()
  inventoryId: number;

  @ManyToOne(() => users, (user) => user.inventory)
  @JoinColumn({ name: 'userId' })
  userId: number;

  @ManyToOne(() => items)
  @JoinColumn({ name: 'itemId' })
  itemId: items;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  purchaseDate: Date;
}
