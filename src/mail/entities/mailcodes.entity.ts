import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class mailCodes {
  @PrimaryGeneratedColumn()
  emailCodeId: number;

  @Column({ nullable: false })
  userId: number;

  @Column({ type: 'bit', width: 1, nullable: false })
  type: 0 | 1; // 0 - verification, 1 - password reset

  @Column({ type: 'char', length: 60, nullable: true, unique: true })
  token: string;

  @Column({ nullable: false })
  expiration: Date;
}
