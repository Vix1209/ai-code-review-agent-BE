import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Reference {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  content: string;

  @Column('text')
  embedding: string; // JSON string of the embedding

  @Column('text')
  metadata: string; // JSON string of additional metadata
}
