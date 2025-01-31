import { IsString, IsObject, IsNotEmpty } from 'class-validator';

export class SubmitReferenceDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsObject()
  @IsNotEmpty()
  metadata: object;
}

export class GenerateReviewDto {
  @IsString()
  @IsNotEmpty()
  prompt: string;
}