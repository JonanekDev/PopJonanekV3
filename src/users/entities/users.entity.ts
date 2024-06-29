import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Length, IsEmail } from 'class-validator';
import { Exclude } from 'class-transformer';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

@Entity()
export class users {
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

  @Column({ default: false, nullable: false })
  verified: boolean;

  @Column({ default: 0, nullable: false })
  totalClicks: number;

  @Column({ default: 0, nullable: false })
  clicks: number;

  @Column({ type: 'bigint', default: null, nullable: true, unique: true })
  discordId: string;

  @Column({ default: null })
  avatarId: number;

  @Column({ nullable: false })
  @Exclude()
  regDate: Date;

  @Column({ nullable: false })
  @Exclude()
  lastLogDate: Date;

  authToken: string;
}
