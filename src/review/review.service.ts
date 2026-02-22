import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
import { ReviewDto } from './dto/review.dto.js';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  //Получение отзывов для конткретного магазина=========
  async getByStore(storeId: string) {
    return await this.prisma.review.findMany({
      where: {
        storeId,
      },
      include: {
        user: true,
      },
    });
  }

  //Получение отзыва по id===============================
  async getById(reviewId: string, userId: string) {
    const review = await this.prisma.review.findUnique({
      where: {
        id: reviewId,
        userId,
      },
      include: {
        user: true,
      },
    });

    if (!review)
      throw new NotFoundException(
        'Отзыв не найден или вы не являетесь его владельцем!',
      );

    return review;
  }

  //Создание отзыва======================================
  async create(
    userId: string,
    productId: string,
    storeId: string,
    dto: ReviewDto,
  ) {
    return await this.prisma.review.create({
      data: {
        ...dto,
        product: {
          connect: {
            id: productId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
        store: {
          connect: {
            id: storeId,
          },
        },
      },
    });
  }

  //Удаление отзыва=====================================
  async delete(reviewId: string, userId: string) {
    await this.getById(reviewId, userId);

    return await this.prisma.review.delete({
      where: {
        id: reviewId,
      },
    });
  }
}
