import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ReviewService } from './review.service.js';
import { Auth } from '../auth/decorators/auth.decorator.js';
import { ReviewDto } from './dto/review.dto.js';
import { CurrentUser } from '../user/decorators/user.decorator.js';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  //Получение отзывов для конткретного магазина=========
  @Auth()
  @Get('by-storeId/:storeId')
  async getByStore(@Param('storeId') storeId: string) {
    return await this.reviewService.getByStore(storeId);
  }

  //Создание отзыва======================================
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Post(':productId/:storeId')
  async create(
    @CurrentUser('id') userId: string,
    @Param('productId') productId: string,
    @Param('storeId') storeId: string,
    @Body() dto: ReviewDto,
  ) {
    return await this.reviewService.create(userId, productId, storeId, dto);
  }

  //Удаление отзыва===========================================
  @HttpCode(200)
  @Auth()
  @Delete(':reviewId')
  async delete(
    @Param('reviewId') reviewId: string,
    @CurrentUser('id') userId: string,
  ) {
    return await this.reviewService.delete(reviewId, userId);
  }
}
