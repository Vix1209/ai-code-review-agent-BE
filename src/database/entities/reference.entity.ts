import { Account } from 'src/resources/account/entities/account.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Reference {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  content: string;

  @Column('text')
  embedding: string; // JSON string of the embedding

  @Column('text')
  metadata: string; // JSON string of additional metadata

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Account, (account) => account.references, { nullable: true })
  accountId: Account;
}

// import { Account } from 'src/resources/account/entities/account.entity';
// import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

// @Entity()
// export class Reference {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @Column('text')
//   content: string;

//   @Column('text')
//   embedding: string; // JSON string of the embedding

//   @Column('text')
//   metadata: string; // JSON string of additional metadata

//   @ManyToOne(() => Account, (account) => account.references, { nullable: true })
//   accountId: Account;
// }
