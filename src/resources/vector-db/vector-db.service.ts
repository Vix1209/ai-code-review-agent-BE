import { Injectable } from '@nestjs/common';
import { Pinecone, Index } from '@pinecone-database/pinecone';

@Injectable()
export class VectorDbService {
  private pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY || '',
  });
  private namespace: string;
  private index: Index;

  constructor() {
    this.index = this.pc.index(
      process.env.INDEX_NAME || '',
      process.env.INDEX_HOST || '',
    );
    this.namespace = 'query-namespace';
  }

  async upsertEmbedding(vectors: {
    id: string;
    values: number[];
    metadata?: Record<string, any>;
  }): Promise<void> {
    await this.index.namespace(this.namespace).upsert([vectors]);
  }

  async searchEmbedding(queryEmbedding: number[], topK: number) {
    // Perform similarity search
    const response = await this.index.namespace(this.namespace).query({
      vector: queryEmbedding,
      topK,
      includeMetadata: true,
    });

    return response.matches.map((match) => ({
      id: match.id,
      score: match.score,
      metadata: match.metadata,
    }));
  }

  async testPineconeConnection() {
    try {
      const stats = await this.pc.describeIndex(process.env.INDEX_NAME || '');
      console.log('✅ Connected to Pinecone:', stats);
    } catch (error) {
      console.error('❌ Error connecting to Pinecone:', error);
    }
  }
}
