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
    this.model = process.env.LLM_MODEL || 'gpt-4o-mini';
  }

  async generateFeedback(
    prompt: string,
    previousFeedback?: string,
  ): Promise<ChatCompletionMessage> {
    // Build messages array
    const messages: any[] = [];

    // If there's previous feedback to learn from, add system message
    if (previousFeedback) {
      messages.push({
        role: 'system',
        content: `When generating feedback, take into account the user's previous interactions and feedback history: ${previousFeedback}`,
      });
    }

    // Add the user prompt
    messages.push({
      role: 'user',
      content: prompt,
    });

    // Generate completion
    const completion = await this.openai.chat.completions.create({
      messages,
      // max_tokens: 1024,
      store: true,
      model: this.model,
    });

    return completion.choices[0].message;
  }

  async processFeedback(
    originalReview: string,
    userFeedback: string,
  ): Promise<string> {
    // Process the user feedback to extract learnings for future reviews
    const completion = await this.openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content:
            'Extract key learnings from user feedback to improve future reviews. Format the response as concise, actionable points.',
        },
        {
          role: 'user',
          content: `Original review: ${originalReview}\n\nUser feedback: ${userFeedback}`,
        },
      ],
      model: this.model,
    });

    return completion.choices[0].message.content ?? '';
  }
}

// import { Injectable } from '@nestjs/common';
// import OpenAI from 'openai';
// import { ChatCompletionMessage } from 'openai/resources/chat/completions';

// @Injectable()
// export class LlmService {
//   private openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY,
//   });
//   private model: string;

//   constructor() {
//     this.model = process.env.LLM_MODEL || 'gpt-4o-mini';
//   }

//   async generateFeedback(prompt: string): Promise<ChatCompletionMessage> {
//     const completion = await this.openai.chat.completions.create({
//       messages: [
//         {
//           role: 'user',
//           content: prompt,
//         },
//       ],
//       // max_tokens: 1024,
//       store: true,
//       model: this.model,
//     });

//     return completion.choices[0].message;
//   }
// }
