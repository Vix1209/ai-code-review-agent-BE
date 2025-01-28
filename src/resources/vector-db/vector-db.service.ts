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
    this.index = this.pc.index('query-index');
    this.namespace = 'query-namespace';
  }

  // async createIndex(indexName: string, dimension: number): Promise<void> {
  //   await this.pc.createIndex({
  //     name: indexName,
  //     dimension: dimension || 1024,
  //     metric: 'cosine',
  //     spec: {
  //       serverless: {
  //         cloud: 'aws',
  //         region: 'us-east-1',
  //       },
  //     },
  //   });
  // }

  async upsertEmbedding(vectors: {
    id: string;
    values: number[];
    metadata?: Record<string, any>;
  }): Promise<void> {
    await this.index.namespace(this.namespace).upsert([vectors]);
  }

  // async query(
  //   indexName: string,
  //   vector: number[],
  //   topK: number = 10,
  //   filter?: Record<string, any>,
  // ): Promise<any> {
  //   const index = this.pc.index(indexName);

  //   const queryRequest = {
  //     vector,
  //     topK,
  //     includeMetadata: true,
  //     includeValues: false,
  //     ...(filter ? { filter } : {}),
  //   };
  //   return await index.query(queryRequest);
  // }

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
}
