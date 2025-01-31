import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  prompt: string;

  @Column('text')
  enrichedPrompt: string;

  @Column('text')
  feedback: string; // Response from LLM
}
