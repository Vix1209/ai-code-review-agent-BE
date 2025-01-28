import { Controller, Post, Body } from '@nestjs/common';
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

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
}
