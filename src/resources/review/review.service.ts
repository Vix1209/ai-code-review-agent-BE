import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EmbeddingService } from '../embedding/embedding.service';
import { LlmService } from '../llm/llm.service';
import { VectorDbService } from '../vector-db/vector-db.service';
import { DatabaseService } from '../database/database.service';
import {
  GenerateReviewDto,
  SubmitReferenceDto,
  SubmitFeedbackDto,
} from './dto/resource.dto';

@Injectable()
export class ReviewService {
  constructor(
    private readonly embeddingService: EmbeddingService,
    private readonly vectorDbService: VectorDbService,
    private readonly llmService: LlmService,
    private readonly databaseService: DatabaseService,
  ) {}

  async processReference(data: SubmitReferenceDto) {
    const { content, metadata, userId } = data;

    if (userId) {
      // Generate embedding for the content
      const embedding = await this.embeddingService.generateEmbedding(content);

      // Create a unique ID for the reference that includes the user ID
      const referenceId =
        metadata.id || `${userId}-${Date.now()}-${content.slice(0, 10)}`;

      // Store embedding in the vector database with user-specific namespace
      const userNamespace = `user-references-${userId}`;

      await this.vectorDbService.upsertEmbedding({
        id: referenceId,
        values: embedding,
        metadata: {
          ...metadata,
          content,
          userId, // Include userId in metadata for filtering
        },
        namespace: userNamespace,
      });

      // Save reference to the database
      await this.databaseService.saveReference(
        content,
        embedding,
        metadata,
        userId,
      );

      return { success: true, message: 'Reference stored successfully.' };
    } else {
      throw new NotFoundException(
        'No active user found. Cannot store reference',
      );
    }
  }

  async generateReview(data: GenerateReviewDto) {
    const { prompt, userId } = data;
    // Generate embedding for the query prompt
    const queryEmbedding =
      await this.embeddingService.generateEmbedding(prompt);

    if (userId) {
      // First, search for user-specific feedback history
      const userFeedbackNamespace = `user-feedback-${userId}`;
      const feedbackResults = await this.vectorDbService.searchEmbedding(
        queryEmbedding,
        1, // Get the most relevant feedback
        userId,
        userFeedbackNamespace,
      );

      // Extract previous feedback if available
      let previousFeedback = '';
      if (
        feedbackResults.length > 0 &&
        Number(feedbackResults[0].score) > 0.7
      ) {
        // Only use if similarity is high
        previousFeedback = String(feedbackResults[0].metadata?.content || '');
      }

      // Next, search for user-specific references
      const userReferencesNamespace = `user-references-${userId}`;
      const userReferences = await this.vectorDbService.searchEmbedding(
        queryEmbedding,
        Number(process.env.TOP_K_VALUE) || 3,
        userId,
        userReferencesNamespace,
      );

      // Also search general references but with lower priority
      const generalReferences = await this.vectorDbService.searchEmbedding(
        queryEmbedding,
        Number(process.env.TOP_K_VALUE) || 3,
      );

      // Combine context from search results, prioritizing user-specific references
      let context = '';

      // Add user-specific references first
      if (userReferences.length > 0) {
        context += "User's Personal References:\n";
        context += userReferences
          .map((result) => result.metadata?.content || '')
          .join('\n');
        context += '\n\n';
      }

      // Add general references if needed and different from user references
      if (generalReferences.length > 0) {
        context += 'Additional References:\n';
        context += generalReferences
          .map((result) => result.metadata?.content || '')
          .join('\n');
      }

      // Enrich the prompt with retrieved context
      const enrichedPrompt = `${prompt}\n\nContext:\n${context}`;

      // Use the LLM to generate feedback with previous feedback learning
      const feedbackResponse = await this.llmService.generateFeedback(
        enrichedPrompt,
        previousFeedback,
      );

      if (feedbackResponse) {
        const feedback = feedbackResponse.content || '';

        // Update user table with review data
        const reviewId = await this.databaseService.saveReview(
          prompt,
          enrichedPrompt,
          feedback,
          userId,
        );

        return { feedback, reviewId };
      } else {
        return { feedback: 'No feedback available.' };
      }
    } else {
      // Use the LLM to generate feedback
      const feedbackResponse = await this.llmService.generateFeedback(prompt);
      if (feedbackResponse) {
        const feedback = feedbackResponse.content || ''; // Ensure feedback is always a string
        return { feedback };
      } else {
        return { feedback: 'No feedback available.' };
      }
    }
  }

  async processFeedback(data: SubmitFeedbackDto) {
    const { reviewId, feedback, userId } = data;

    if (!userId) {
      return {
        success: false,
        message: 'No User ID found! It is required to process feedback.',
      };
    }
    if (!reviewId) {
      return {
        success: false,
        message: 'No Review ID! It is required to process feedback.',
      };
    }

    try {
      // Get the original review from the database
      const review = await this.databaseService.getSingleReview(reviewId);

      if (review.account.id !== userId) {
        return {
          success: false,
          message: 'Not associated with this user.',
        };
      }
      if (!review) {
        return {
          success: false,
          message: 'Review not found.',
        };
      }

      // Process feedback to extract learnings
      const processedFeedback = await this.llmService.processFeedback(
        review.feedback,
        feedback,
      );

      // Create an embedding for the processed feedback
      const feedbackEmbedding = await this.embeddingService.generateEmbedding(
        review.prompt + ' ' + processedFeedback,
      );

      // Store the feedback in a user-specific namespace
      const userFeedbackNamespace = `user-feedback-${userId}`;

      await this.vectorDbService.upsertEmbedding({
        id: `feedback-${reviewId}`,
        values: feedbackEmbedding,
        metadata: {
          content: processedFeedback,
          originalPrompt: review.prompt,
          originalFeedback: review.feedback,
          userFeedback: feedback,
          userId,
          feedbackType: 'review-feedback',
          timestamp: new Date().toISOString(),
        },
        namespace: userFeedbackNamespace,
      });

      // Update the review in the database with the feedback
      await this.databaseService.updateReviewWithFeedback(
        reviewId,
        feedback,
        processedFeedback,
      );

      return {
        success: true,
        message: 'Feedback processed and stored successfully.',
      };
    } catch (error) {
      return {
        success: false,
        message: `Error processing feedback: ${error.message}`,
      };
    }
  }

  async getReviews(userId: string) {
    const reviews = await this.databaseService.getAllReviews(userId);
    return reviews;
  }

  async getSingleReview(id: string) {
    const reviews = await this.databaseService.getSingleReview(id);
    return reviews;
  }

  async getReferences(userId: string) {
    const reference = await this.databaseService.getAllReferences(userId);
    return reference;
  }

  async getSingleReference(id: string) {
    const reference = await this.databaseService.getSingleReference(id);
    return reference;
  }
}
