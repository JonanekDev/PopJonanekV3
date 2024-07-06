import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Length, IsEmail } from 'class-validator';
import { Exclude } from 'class-transformer';
import { ConfigService } from '@nestjs/config';
import { Inventory } from './inventory.entity';
import { Item } from 'src/shop/entitities/item.entity';

const configService = new ConfigService();

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column({
    length: configService.get<number>('username.max'),
    nullable: false,
  })
  @Length(
    configService.get<number>('username.min'),
    configService.get<number>('username.max'),
  )
  username: string;

  @Column({ length: 320, nullable: false, unique: true })
  @IsEmail()
  email: string;

  @Column({ type: 'char', length: 60, nullable: true })
  @Exclude()
  password: string;

  @Column({ width: 1, default: false, nullable: false })
  verified: boolean;

  @Column({ default: 0, nullable: false })
  totalClicks: number;

  @Column({ default: 0, nullable: false })
  clicks: number;

  @ManyToOne(() => Item)
  @JoinColumn({ name: 'activeBackgroundId' })
  activeBackgroundId: number;

  @ManyToOne(() => Item)
  @JoinColumn({ name: 'activeSoundId' })
  activeSoundId: number;

  @Column({ type: 'bigint', default: null, nullable: true, unique: true })
  discordId: string;

  @Column({ default: null })
  avatarId: number;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  @Exclude()
  regDate: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  @Exclude()
  lastLogDate: Date;

  @OneToMany(() => Inventory, (inventory) => inventory.userId)
  inventory: Inventory[];

  authToken: string;

  //TODO: relation mailcodes
}
