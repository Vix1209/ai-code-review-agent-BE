import { Reference } from 'src/database/entities/reference.entity';
import { Review } from 'src/database/entities/review.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity({ name: 'accounts' })
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ default: 'active' })
  status: 'active' | 'inactive';

  @Column({ type: 'varchar', nullable: true, select: false })
  resetToken: string | null;

  @Column({ type: 'datetime', nullable: true, select: false })
  resetTokenExpiry: Date | null;

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

  @OneToMany(() => Reference, (reference) => reference.accountId)
  references: Reference[];

  @OneToMany(() => Review, (review) => review.accountId)
  reviews: Review[];
}
