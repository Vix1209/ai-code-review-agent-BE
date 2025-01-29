import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reference } from './entities/reference.entity';
import { Review } from './entities/review.entity';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectRepository(Reference)
    private readonly referenceRepository: Repository<Reference>,
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) { }
  
  

  //  Save a reference (e.g., snippet and embedding) to the database.
  async saveReference(
    content: string,
    embedding: number[],
    metadata: object,
  ): Promise<Reference> {
    const reference = this.referenceRepository.create({
      content,
      embedding: JSON.stringify(embedding), // Store as a JSON string
      metadata: JSON.stringify(metadata),
    });
    return await this.referenceRepository.save(reference);
  }

  // Save a review to the database.
  async saveReview(
    prompt: string,
    enrichedPrompt: string,
    feedback: string,
  ): Promise<Review> {
    const review = this.reviewRepository.create({
      prompt,
      enrichedPrompt,
      feedback,
    });
    return await this.reviewRepository.save(review);
  }

  //  Fetch all references for debugging or audit purposes.
  async getAllReferences(): Promise<Reference[]> {
    return await this.referenceRepository.find();
  }

  // Fetch all reviews for debugging or audit purposes.
  async getAllReviews(): Promise<Review[]> {
    return await this.reviewRepository.find();
  }
}
