import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductService } from './product.service.js';
import { Auth } from '../auth/decorators/auth.decorator.js';
import { ProductDto } from './dto/product.dto.js';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  //Получение всех товаров============================
  @Get()
  async getAll(@Query('searchTerm') searchTerm?: string) {
    return this.productService.getAll(searchTerm);
  }

  //Получение товаров для конткретного магазина=========
  @Auth()
  @Get('by-storeId/:storeId')
  async getByStore(@Param('storeId') storeId: string) {
    return await this.productService.getByStore(storeId);
  }

  //Получение товара по id===============================
  //   @Auth()
  @Get('by-id/:productId')
  async getById(@Param('productId') productId: string) {
    return await this.productService.getById(productId);
  }

  //Получение товаров по категории=========================
  @Get('by-category/:categoryId')
  async getByCategory(@Param('categoryId') categoryId: string) {
    return await this.productService.getByCategory(categoryId);
  }

  //Получение популярных товаров==============================
  @Get('most-popular')
  async getMostPopular() {
    return await this.productService.getMostPopular();
  }

  //Получение похожих товаров===========================
  @Get('similar/:similarId')
  async getSimilar(@Param('similarId') similarId: string) {
    return await this.productService.getSimilar(similarId);
  }

  //Создание товара========================================
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Post(':storeId')
  async create(@Param('storeId') storeId: string, @Body() dto: ProductDto) {
    return await this.productService.create(storeId, dto);
  }

  //Обновление товара=======================================
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Put(':productId')
  async update(@Param('productId') productId: string, @Body() dto: ProductDto) {
    return await this.productService.update(productId, dto);
  }

  //Удаление товара===========================================
  @HttpCode(200)
  @Auth()
  @Delete(':productId')
  async delete(@Param('productId') productId: string) {
    return await this.productService.delete(productId);
  }
}
