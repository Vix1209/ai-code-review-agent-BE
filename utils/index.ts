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
