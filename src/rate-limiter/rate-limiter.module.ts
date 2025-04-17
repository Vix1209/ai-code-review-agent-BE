import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        // ttl: 60000, // 1 min
        ttl: 86400000, // 1 day
        limit: 3, // 3 requests
      },
    ]),
  ],
})
export class RateLimiterModule {}
