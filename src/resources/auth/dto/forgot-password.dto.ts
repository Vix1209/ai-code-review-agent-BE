import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

// src/user/dto/forgot-password.dto.ts
export class ForgotPasswordDto {
  @ApiProperty({
    description: 'The user email',
    example: '',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
