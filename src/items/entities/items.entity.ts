import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class items {
  @PrimaryGeneratedColumn()
  itemId: number;

  @Column({ length: 90, nullable: false })
  name: string;

  @Column({ type: 'bit', width: 2, nullable: false })
  rarity: 0 | 1 | 2; // 0 - common, 1 - rare, 2 - legendary
}
