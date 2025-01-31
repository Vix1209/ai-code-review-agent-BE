import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Reference } from './entities/reference.entity';
import { Review } from './entities/review.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      // type: 'mysql',
      // host: process.env.DB_HOST,
      // port: Number(process.env.DB_PORT) || 5432,
      // username: process.env.DB_USER,
      // password: process.env.DB_PASSWORD,
      // database: process.env.DB_NAME,
      type: 'postgres',
      url: process.env.DB_URL,
      ssl: {
        rejectUnauthorized: false,
      },
      entities: [Reference, Review],
      synchronize: true, // Turn off in production
    }),
    TypeOrmModule.forFeature([Reference, Review]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
