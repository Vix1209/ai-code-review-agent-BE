import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reference } from './entities/reference.entity';
import { Review } from './entities/review.entity';
import { Account } from '../account/entities/account.entity';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectRepository(Reference)
    private readonly referenceRepository: Repository<Reference>,
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  //  Save a reference (e.g., snippet and embedding) to the database.
  async saveReference(
    content: string,
    embedding: number[],
    metadata: object,
    userId: string,
  ): Promise<Reference> {
    const reference = this.referenceRepository.create({
      content,
      embedding: JSON.stringify(embedding), // Store as a JSON string
      metadata: JSON.stringify(metadata),
    });

    const user = await this.accountRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (user) {
      reference.accountId = user;
    }

    return await this.referenceRepository.save(reference);
  }

  // Save a review to the database.
  async saveReview(
    prompt: string,
    enrichedPrompt: string,
    feedback: string,
    userId: string,
  ): Promise<Review> {
    const review = this.reviewRepository.create({
      prompt,
      enrichedPrompt,
      feedback,
    });

    const user = await this.accountRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (user) {
      review.accountId = user;
    }

    return await this.reviewRepository.save(review);
  }

  //  Fetch all references for debugging or audit purposes.
  async getAllReferences(): Promise<Reference[]> {
    return await this.referenceRepository.find({
      relations: {
        accountId: true,
      },
    });
  }

  //  Fetch all references for debugging or audit purposes.
  async getSingleReference(id: string): Promise<Reference> {
    const reference = await this.referenceRepository.findOne({
      where: {
        id: Number(id),
      },
    });
    if (!reference) {
      throw new Error(`Reference with id ${id} not found`);
    }
    return reference;
  }

  // Fetch all reviews for debugging or audit purposes.
  async getAllReviews(): Promise<Review[]> {
    return await this.reviewRepository.find({
      relations: {
        accountId: true,
      },
    });
  }

  async getSingleReview(id: string): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: {
        id: Number(id),
      },
    });
    if (!review) {
      throw new Error(`Review with id ${id} not found`);
    }
    return review;
  }
}
