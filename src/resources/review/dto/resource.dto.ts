import { IsString, IsObject, IsNotEmpty } from 'class-validator';
import { GlobalApiResponse } from 'utils';

export class SubmitReferenceDto {
  @IsString()
  @IsNotEmpty()
  @GlobalApiResponse(
    'The Reference bearing the context to be saved to the Vector DB',
  )
  content: string;

  @IsObject()
  @IsNotEmpty()
  @GlobalApiResponse(
    'The metadata bearing uniique identifiers for each reference',
  )
  metadata: object;
}

export class GenerateReviewDto {
  @IsString()
  @IsNotEmpty()
  @GlobalApiResponse('The Actual Prompt to be sent to the LLM')
  prompt: string;
}
