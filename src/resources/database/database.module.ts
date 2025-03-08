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
    TypeOrmModule.forRootAsync({ useFactory: createTypeOrmConfig }),
    TypeOrmModule.forFeature([Reference, Review]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}

export function createTypeOrmConfig(): any {
  if (process.env.NODE_ENV === 'development') {
    console.log('Connecting to local MySQL database on MySQL Workbench');
    return {
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: {
        rejectUnauthorized: false,
      },
      autoLoadEntities: true,
      synchronize: false,
    };
  } else {
    const dbUrl = process.env.DB_URL;

    if (!dbUrl) {
      throw new Error('Database URL is not defined in environment variables');
    }

    console.log(`Connecting to Cloud database`);
    return {
      type: 'mysql',
      url: dbUrl,
      ssl: {
        rejectUnauthorized: false,
      },
      autoLoadEntities: true,
      synchronize: false,
    };
  }
}
