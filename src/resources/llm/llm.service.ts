import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { ChatCompletionMessage } from 'openai/resources/chat/completions';

@Injectable()
export class LlmService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  private model: string;

  constructor() {
    this.model = process.env.EMBEDDING_MODEL || 'gpt-4o-mini';
  }

  async generateFeedback(prompt: string): Promise<ChatCompletionMessage> {
    const completion = await this.openai.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: this.model,
    });

    return completion.choices[0].message;
  }
}
