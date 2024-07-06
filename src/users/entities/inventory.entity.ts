import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Item } from 'src/shop/entitities/item.entity';

@Entity('inventories')
export class Inventory {
  @PrimaryGeneratedColumn()
  inventoryId: number;

  @ManyToOne(() => User, (user) => user.inventory)
  @JoinColumn({ name: 'userId' })
  userId: number;

  @ManyToOne(() => Item)
  @JoinColumn({ name: 'itemId' })
  itemId: number;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  purchaseDate: Date;
}
