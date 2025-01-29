import { Controller, Post, Body, Get } from '@nestjs/common';
import { ReviewService } from './review.service';
import { VectorDbService } from '../vector-db/vector-db.service';
import { EmbeddingService } from '../embedding/embedding.service';

@Controller()
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly vectorbdService: VectorDbService,
    private readonly embedService: EmbeddingService,
  ) {}

  @Post('submit-reference')
  async submitReference(@Body() data: { content: string; metadata: object }) {
    return await this.reviewService.processReference(
      data.content,
      data.metadata,
    );
  }

  @Post('generate-review')
  async generateReview(@Body() data: { prompt: string }) {
    try {
      const query = await this.reviewService.generateReview(data.prompt);
      return { data: query, status: 'success' };
    } catch (error) {
      return { data: error.message, status: 'failed' };
    }
  }

  @Post('test-pinecone-connection')
  async testConnection() {
    return await this.vectorbdService.testPineconeConnection();
  }

  @Post('test-generate-Embedding')
  async generateEmbedding() {
    return await this.embedService.generateEmbedding('Hello, just checking');
  }

  @Get('review')
  async getReviews() {
    return await this.reviewService.getReviews();
  }

  @Get('reference')
  async getReference() {
    return await this.reviewService.getReferences();
  }
}
