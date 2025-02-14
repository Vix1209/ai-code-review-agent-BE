import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'accounts' })
export class Account {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ default: 'active' })
  status: 'active' | 'inactive';

  @Column({ nullable: true, select: false })
  resetToken: string;

  @Column({ nullable: true, select: false })
  resetTokenExpiry: Date;

  @CreateDateColumn({
    select: false,
  })
  createdAt: Date;

  @UpdateDateColumn({
    nullable: true,
    select: false,
  })
  updatedAt: Date;

  @DeleteDateColumn({
    nullable: true,
  })
  deletedAt: Date;
}
