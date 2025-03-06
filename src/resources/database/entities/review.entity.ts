import { Account } from 'src/resources/account/entities/account.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  prompt: string;

  @Column('text')
  enrichedPrompt: string;

  @Column('text')
  feedback: string; // Response from LLM

  @Column('text', { nullable: true })
  userFeedback: string; // Feedback from user about the review quality

  @Column('text', { nullable: true })
  processedFeedback: string; // AI's interpretation of user feedback for learning

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Account, (account) => account.reviews, { nullable: true })
  account: Account;
  @JoinColumn()
  accountId: string;
}

// import { Account } from 'src/resources/account/entities/account.entity';
// import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

// @Entity()
// export class Review {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @Column('text')
//   prompt: string;

//   @Column('text')
//   enrichedPrompt: string;

//   @Column('text')
//   feedback: string; // Response from LLM

//   @ManyToOne(() => Account, (account) => account.reviews, { nullable: true })
//   accountId: Account;
// }
