import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Put,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { UpdatePasswordDto } from '../auth/dto/update-password.dto';
import { GlobalApiResponse } from 'utils';

@Controller({ path: 'accounts', version: '1' })
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get()
  @GlobalApiResponse('Global API response for account controller')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Get all accounts' })
  async findAll() {
    const result = await this.accountService.findAll();
    return {
      status: 'success',
      ...result,
    };
  }

  @Patch('update-password')
  @GlobalApiResponse('Global API response for account controller')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT')
  @ApiQuery({
    name: 'email',
    required: true,
    description: 'Email whose password is to be updated',
  })
  @ApiOperation({ summary: 'Update Password of a particular account' })
  async updatePassword(
    @Query() queryParams,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    if (queryParams.email) {
      updatePasswordDto.email = queryParams.email;
    }

    const data = await this.accountService.updatePassword(updatePasswordDto);
    return {
      data,
      status: 'success',
    };
  }

  @Patch(':id/status-toggle')
  @GlobalApiResponse('Global API response for account controller')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Deactivate or activate an account' })
  async toggelStatus(@Param('id') id: string) {
    const data = await this.accountService.toggleAccountStatus(id);
    return {
      data,
      status: 'success',
    };
  }

  @Delete(':id/delete')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Delete an account' })
  async remove(@Param('id') id: string) {
    const data = await this.accountService.deleteAccount(id);
    return {
      data,
      status: 'success',
    };
  }

  @Put(':id/restore')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Restore an account' })
  async restore(@Param('id') id: string) {
    const data = await this.accountService.restoreAccount(id);
    return {
      data,
      status: 'success',
    };
  }
}
