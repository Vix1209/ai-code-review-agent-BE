import { Injectable } from '@nestjs/common';
import { Pinecone, Index } from '@pinecone-database/pinecone';

@Injectable()
export class VectorDbService {
  private pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY || '',
  });
  private index: Index;
  private model: string;

  constructor() {
    this.index = this.pc.index(
      process.env.INDEX_NAME || '',
      process.env.INDEX_HOST || '',
    );
    this.model = process.env.EMBEDDING_MODEL || 'text-embedding-ada-002';
  }

  async upsertEmbedding(vectors: {
    id: string;
    values: number[];
    metadata?: Record<string, any>;
    namespace?: string;
  }): Promise<void> {
    const { metadata, namespace = 'query-namespace' } = vectors;

    await this.index.namespace(namespace).upsert([
      {
        id: vectors.id,
        values: vectors.values,
        metadata: {
          id: metadata?.id,
          userId: metadata?.userId, // Add userId to metadata
          author: metadata?.author,
          category: metadata?.category,
          timestamp: metadata?.timestamp,
          content: metadata?.content,
          feedbackType: metadata?.feedbackType, // For storing feedback
        },
      },
    ]);
  }

  async searchEmbedding(
    queryEmbedding: number[],
    topK: number,
    userId?: string,
    namespace?: string,
  ) {
    // Set default namespace if not provided
    const ns = namespace || 'query-namespace';

    // Create query parameters
    const queryParams: any = {
      vector: queryEmbedding,
      topK,
      includeMetadata: true,
    };

    // If userId is provided, add filter to only return vectors with matching userId
    if (userId) {
      queryParams.filter = {
        userId: { $eq: userId },
      };
    }

    // Perform similarity search
    const response = await this.index.namespace(ns).query(queryParams);

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
