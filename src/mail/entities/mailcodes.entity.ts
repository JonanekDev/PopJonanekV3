import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class mailCodes {
  @PrimaryGeneratedColumn()
  emailCodeId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  @Column({ nullable: false })
  userId: number;

  @Column({ type: 'bit', width: 1, nullable: false })
  type: 0 | 1; // 0 - verification, 1 - password reset

  @Column({ type: 'char', length: 60, nullable: true, unique: true })
  token: string;

  @Column({ nullable: false })
  expiration: Date;
}
