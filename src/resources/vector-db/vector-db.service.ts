import { Injectable } from '@nestjs/common';
import { Pinecone, Index } from '@pinecone-database/pinecone';

@Injectable()
export class VectorDbService {
  private pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY || '',
  });
  private namespace: string;
  private index: Index;
  private model: string;

  constructor() {
    this.index = this.pc.index(
      process.env.INDEX_NAME || '',
      process.env.INDEX_HOST || '',
    );
    this.namespace = 'query-namespace';
    this.model = process.env.EMBEDDING_MODEL || 'text-embedding-ada-002';
  }

  async upsertEmbedding(vectors: {
    id: string;
    values: number[];
    metadata?: Record<string, any>;
  }): Promise<void> {
    const { metadata } = vectors;
    console.log('Upserting Metadata:', { ...metadata });
    await this.index.namespace(this.namespace).upsert([
      {
        id: vectors.id,
        values: vectors.values,
        metadata: {
          id: metadata?.id,
          author: metadata?.author,
          category: metadata?.category,
          timestamp: metadata?.timestamp,
          content: metadata?.content,
        },
      },
    ]);
  }

  async searchEmbedding(queryEmbedding: number[], topK: number) {
    // Perform similarity search
    const response = await this.index.namespace(this.namespace).query({
      vector: queryEmbedding,
      topK,
      includeMetadata: true,
    });
    console.log('upserting response: ', response);

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
