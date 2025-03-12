import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtGuard } from '../../../utils/guard/jwt.guard';
import { GetUser } from '../../../utils/customDecorators/getUser';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { GlobalApiResponse } from 'utils';
import { AccountDto } from './dto/account.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@GlobalApiResponse('')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register an account' })
  async registerAdmin(@Body() dto: AccountDto) {
    const data = await this.authService.loginOrSignup(dto);
    return {
      data,
      status: 'success',
    };
  }

  @Get('me')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Get Currently logged in User' })
  async getMe(@GetUser() user: any) {
    const { deletedAt, ...userWithoutDeletedAt } = user;
    return { data: userWithoutDeletedAt, status: 'success' };
  }

  @Patch('forgot-password')
  @ApiOperation({ summary: 'Forgot Password' })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.authService.forgotPassword(dto);
    return { status: 'success' };
  }

  @Patch('reset-password')
  @ApiOperation({ summary: 'Reset Password' })
  async resetPassword(
    @Body() dto: ResetPasswordDto,
  ) {
    await this.authService.resetPassword(dto);
    return { status: 'success' };
  }
}
