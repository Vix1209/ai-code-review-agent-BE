import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  Param,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { VectorDbService } from '../vector-db/vector-db.service';
import { EmbeddingService } from '../embedding/embedding.service';
import { GenerateReviewDto, SubmitReferenceDto } from './dto/resource.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guard/jwt.guard';

@Controller({ version: '1' })
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly vectorbdService: VectorDbService,
    private readonly embedService: EmbeddingService,
  ) {}

  @Post('submit-reference')
  @ApiOperation({ summary: 'Generate references' })
  async submitReference(@Body() data: SubmitReferenceDto) {
    return await this.reviewService.processReference(data);
  }

  @Post('generate-review')
  @ApiOperation({ summary: 'Generate reviews' })
  async generateReview(@Body() data: GenerateReviewDto) {
    try {
      const query = await this.reviewService.generateReview(data);
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

  @Get('get-review')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Get Reviews received' })
  async getReviews(@Req() request) {
    console.log(request);
    const userId = request.user.id;
    return await this.reviewService.getReviews(userId);
  }

  @Get('get-reference')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Get References' })
  async getReference(@Req() request) {
    const userId = request.user.id;
    return await this.reviewService.getReferences(userId);
  }

  @Get('get-reference/:referenceId')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Get References' })
  async getSingleReference(@Param() referenceId: number) {
    return await this.reviewService.getSingleReference(referenceId);
  }

  @Get('get-review/:reviewId')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Get References' })
  async getSingleReview(@Param() reviewId: number) {
    return await this.reviewService.getSingleReview(reviewId);
  }
}
