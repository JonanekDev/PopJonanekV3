import { Item } from 'src/shop/entitities/item.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('chests')
export class Chest {
  @PrimaryGeneratedColumn()
  chestId: number;

  @Column({ length: 90, nullable: false })
  name: string;

  @Column({ nullable: true })
  price: number;

  @OneToMany(() => Item, (item) => item.chest)
  items: Item[];
}
