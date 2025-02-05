import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Account])],
  // imports: [TypeOrmModule.forFeature([User]), MailModule],
  controllers: [AccountController],
  providers: [AccountService, JwtService],
  exports: [AccountService],
})
export class AccountModule {}
