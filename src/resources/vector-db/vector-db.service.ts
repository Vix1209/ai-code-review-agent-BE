import { Injectable } from '@nestjs/common';
import { Pinecone, Index } from '@pinecone-database/pinecone';
import axios from 'axios';

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

  // async generateEmbedding(content: string) {
  //   try {
  //     const url = `${process.env.INDEX_HOST}/vectors/embed`;

  //     const response = await axios.post(
  //       url,
  //       { text: content, model: this.model },
  //       {
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'Api-Key': process.env.PINECONE_API_KEY,
  //         },
  //       },
  //     );

  //     if (!response.data || !response.data.vector) {
  //       throw new Error('Invalid embedding response from Pinecone');
  //     }

  //     console.log(response.data.vector); // Ensure this is a number[]
  //   } catch (error) {
  //     console.error('Error generating embedding from Pinecone:', error);
  //     throw new Error('Failed to generate embedding.');
  //   }
  // }

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
