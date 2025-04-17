import { Logger, Module, ValidationPipe } from '@nestjs/common';
import { EmbeddingModule } from './resources/embedding/embedding.module';
import { VectorDbModule } from './resources/vector-db/vector-db.module';
import { LlmModule } from './resources/llm/llm.module';
import { ReviewModule } from './resources/review/review.module';
import { DatabaseModule } from './database/database.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { ErrorFilter } from './filters/error.filters';
import { AccountModule } from './resources/account/account.module';
import { AuthModule } from './resources/auth/auth.module';
import { RateLimiterModule } from './rate-limiter/rate-limiter.module';
import { ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [
    EmbeddingModule,
    VectorDbModule,
    LlmModule,
    ReviewModule,
    DatabaseModule,
    AccountModule,
    AuthModule,
    RateLimiterModule,
  ],
  providers: [
    Logger,
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: ErrorFilter,
    },

    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
