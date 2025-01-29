import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { EmbeddingModule } from '../embedding/embedding.module';
import { EmbeddingService } from '../embedding/embedding.service';
import { LlmService } from '../llm/llm.service';
import { DatabaseService } from '../database/database.service';
import { DatabaseModule } from '../database/database.module';
import { LlmModule } from '../llm/llm.module';
import { VectorDbModule } from '../vector-db/vector-db.module';
import { VectorDbService } from '../vector-db/vector-db.service';

@Module({
  imports: [EmbeddingModule, DatabaseModule, LlmModule, VectorDbModule],
  controllers: [ReviewController],
  providers: [
    ReviewService,
    EmbeddingService,
    LlmService,
    DatabaseService,
    VectorDbService,
  ],
})
export class ReviewModule {}
