import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class EmbeddingService {
  private openai: OpenAI;
  private model: string;

  constructor() {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });
    this.model = process.env.EMBEDDING_MODEL || 'text-embedding-3-large';
  }

  async generateEmbedding(content: string): Promise<number[]> {
    const response = await this.openai.embeddings.create({
      model: this.model,
      input: content,
    });

    return response.data[0].embedding;
  }
}
