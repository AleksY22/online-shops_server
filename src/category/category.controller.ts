import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CategoryService } from './category.service.js';
import { Auth } from '../auth/decorators/auth.decorator.js';
import { CategoryDto } from './dto/category.dto.js';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  //Получение категорий для конткретного магазина==============
  @Auth()
  @Get('by-storeId/:storeId')
  async getByStore(@Param('storeId') storeId: string) {
    return await this.categoryService.getByStore(storeId);
  }

  //Получение категории по id==================================
  @Get('by-id/:categoryId')
  async getById(@Param('categoryId') categoryId: string) {
    return await this.categoryService.getById(categoryId);
  }

  //Создание категории========================================
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Post(':storeId')
  async create(@Param('storeId') storeId: string, @Body() dto: CategoryDto) {
    return await this.categoryService.create(storeId, dto);
  }

  //Обновление категории=====================================
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Put(':categoryId')
  async update(
    @Param('categoryId') categoryId: string,
    @Body() dto: CategoryDto,
  ) {
    return await this.categoryService.update(categoryId, dto);
  }

  //Удаление цвета=======================================
  @HttpCode(200)
  @Auth()
  @Delete(':categoryId')
  async delete(@Param('categoryId') categoryId: string) {
    return await this.categoryService.delete(categoryId);
  }
}
