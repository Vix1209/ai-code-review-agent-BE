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
import {
  GenerateReviewDto,
  SubmitReferenceDto,
  SubmitFeedbackDto,
} from './dto/resource.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../../../utils/guard/jwt.guard';
import { BlockRequests } from 'utils/customDecorators/blockRequests';

@Controller({ version: '1' })
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly vectorbdService: VectorDbService,
    private readonly embedService: EmbeddingService,
  ) {}

  @Post('submit-reference')
  @BlockRequests()
  @ApiOperation({ summary: 'Submit a reference document' })
  async submitReference(@Body() data: SubmitReferenceDto) {
    return await this.reviewService.processReference(data);
  }

  @Post('generate-review')
  @BlockRequests()
  @ApiOperation({ summary: 'Generate a personalized review' })
  async generateReview(@Body() data: GenerateReviewDto) {
    try {
      const query = await this.reviewService.generateReview(data);
      return { data: query, status: 'success' };
    } catch (error) {
      return { data: error.message, status: 'failed' };
    }
  }

  @Post('submit-feedback')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT')
  @BlockRequests()
  @ApiOperation({
    summary: 'Submit feedback on a review to improve future responses',
  })
  async submitFeedback(@Body() data: SubmitFeedbackDto, @Req() request) {
    try {
      // Ensure userId is always set from authenticated user
      if (request.user.id) {
        data.userId = request.user.id;
      }
      const result = await this.reviewService.processFeedback(data);
      return { data: result, status: 'success' };
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
  @ApiOperation({ summary: 'Get a single reference' })
  async getSingleReference(@Param('referenceId') referenceId: string) {
    return await this.reviewService.getSingleReference(referenceId);
  }

  @Get('get-review/:reviewId')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Get a single review' })
  async getSingleReview(@Param('reviewId') reviewId: string) {
    return await this.reviewService.getSingleReview(reviewId);
  }
}
