import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  prompt: string;

  @Column()
  enrichedPrompt: string;

  @Column()
  feedback: string; // Response from LLM
}
