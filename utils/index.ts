import { HttpException, HttpStatus } from '@nestjs/common';
import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export function GlobalApiResponse(description: string) {
  return applyDecorators(
    ApiProperty({
      description: `${description}`,
      example: '',
    }),
  );
}

export class EmailValidationException extends HttpException {
  constructor() {
    super('Invalid email address', HttpStatus.BAD_REQUEST);
  }
}
