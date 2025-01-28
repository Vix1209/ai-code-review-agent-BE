import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Reference {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column()
  embedding: string; // JSON string of the embedding

  @Column()
  metadata: string; // JSON string of additional metadata
}
