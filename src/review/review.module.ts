import { Module } from '@nestjs/common';
import { ReviewService } from './review.service.js';
import { ReviewController } from './review.controller.js';
import { PrismaService } from '../prisma.service.js';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService, PrismaService],
})
export class ReviewModule {}
