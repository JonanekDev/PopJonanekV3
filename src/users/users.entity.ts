import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Length, IsEmail } from 'class-validator';
import { Exclude } from 'class-transformer';

@Entity()
export class users {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column({ length: 30, nullable: false })
  @Length(5, 30)
  username: string;

  @Column({ length: 320, nullable: false })
  @IsEmail()
  email: string;

  @Column()
  @Exclude()
  passwordSalt: string;

  @Column({ type: 'char', length: 60, nullable: true })
  @Exclude()
  password: string;

  @Column({ default: false })
  verified: boolean;

  @Column({ default: 0 })
  totalClicks: number;

  @Column({ default: 0 })
  clicks: number;

  @Column({ type: 'bigint', default: null, nullable: true })
  discordId: string;

  @Column({ default: null })
  avatarId: number;

  @Column({ nullable: false })
  @Exclude()
  regDate: Date;

  @Column({ nullable: false })
  @Exclude()
  lastLogDate: Date;
}
