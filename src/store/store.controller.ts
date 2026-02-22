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
import { StoreService } from './store.service.js';
import { Auth } from '../auth/decorators/auth.decorator.js';
import { CurrentUser } from '../user/decorators/user.decorator.js';
import { CreateStoreDto } from './dto/create-store.dto.js';
import { UpdateStoreDto } from './dto/update-store.dto.js';

@Controller('stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  //Получение магазина по id=============================
  @Auth()
  @Get('by-id/:id')
  async getById(
    @Param('id') storeId: string,
    @CurrentUser('id') userId: string,
  ) {
    return await this.storeService.getById(storeId, userId);
  }

  //Создание магазина====================================
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Post()
  async create(@CurrentUser('id') userId: string, @Body() dto: CreateStoreDto) {
    return await this.storeService.create(userId, dto);
  }

  //Обновление магазина=================================
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Put(':id')
  async update(
    @CurrentUser('id') userId: string,
    @Param('id') storeId: string,
    @Body() dto: UpdateStoreDto,
  ) {
    return await this.storeService.update(storeId, userId, dto);
  }

  //Удаление магазина=====================================
  @HttpCode(200)
  @Auth()
  @Delete(':id')
  async delete(
    @CurrentUser('id') userId: string,
    @Param('id') storeId: string,
  ) {
    return await this.storeService.delete(storeId, userId);
  }
}
