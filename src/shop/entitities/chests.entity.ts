import { items } from 'src/shop/entitities/items.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class chests {
  @PrimaryGeneratedColumn()
  chestId: number;

  @Column({ length: 90, nullable: false })
  name: string;

  @Column({ nullable: true })
  price: number;

  @OneToMany(() => items, (item) => item.chestId)
  items: items[];
}
