import { Chest } from 'src/shop/entitities/chest.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('items')
export class Item {
  @PrimaryGeneratedColumn()
  itemId: number;

  @Column({ type: 'tinyint', width: 1, nullable: false })
  type: 0 | 1; // 0 - pozadí, 1 - zvuk

  @Column({ length: 90, nullable: false })
  name: string;

  @Column({ type: 'tinyint', width: 1, nullable: false })
  rarity: 0 | 1 | 2; // 0 - common, 1 - rare, 2 - legendary

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: false })
  multiplier: number;

  @ManyToOne(() => Chest, (chest) => chest.items)
  @JoinColumn({ name: 'chestId' })
  @Column({ nullable: false })
  chestId: number;
}
