import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

// src/user/dto/reset-password.dto.ts
export class ResetPasswordDto {
  @ApiProperty({
    description: 'The reset token',
    example: '',
  })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    description: 'The user new password',
    example: '',
  })
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
