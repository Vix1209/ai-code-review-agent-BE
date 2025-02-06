import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';

export class AccountDto {
  @IsString()
  @ApiProperty({
    description: 'The User email',
    example: '',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The User Password',
    example: '',
  })
  @IsString()
  password: string;
}
