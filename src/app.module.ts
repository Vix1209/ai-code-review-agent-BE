import { Module } from '@nestjs/common';
import { EmbeddingModule } from './resources/embedding/embedding.module';
import { VectorDbModule } from './resources/vector-db/vector-db.module';
import { LlmModule } from './resources/llm/llm.module';
import { ReviewModule } from './resources/review/review.module';
import { DatabaseModule } from './resources/database/database.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    EmbeddingModule,
    VectorDbModule,
    LlmModule,
    ReviewModule,
    DatabaseModule,
  ],
})
export class AppModule {}
