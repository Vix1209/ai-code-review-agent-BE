import { Account } from 'src/resources/account/entities/account.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

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

  @ManyToOne(() => Account, (account) => account.reviews, { nullable: true })
  accountId: Account;
}
