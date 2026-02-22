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
import { ColorService } from './color.service.js';
import { Auth } from '../auth/decorators/auth.decorator.js';
import { ColorDto } from './dto/color.dto.js';

@Controller('colors')
export class ColorController {
  constructor(private readonly colorService: ColorService) {}

  //Получение цветов для конткретного магазина==============
  @Auth()
  @Get('by-storeId/:storeId')
  async getByStore(@Param('storeId') storeId: string) {
    return await this.colorService.getByStore(storeId);
  }

  //Получение цвета по id===================================
  @Auth()
  @Get('by-id/:colorId')
  async getById(@Param('colorId') colorId: string) {
    return await this.colorService.getById(colorId);
  }

  //Создание цвета========================================
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Post(':storeId')
  async create(@Param('storeId') storeId: string, @Body() dto: ColorDto) {
    return await this.colorService.create(storeId, dto);
  }

  //Обновление цвета=====================================
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Put(':colorId')
  async update(@Param('colorId') colorId: string, @Body() dto: ColorDto) {
    return await this.colorService.update(colorId, dto);
  }

  //Удаление цвета=======================================
  @HttpCode(200)
  @Auth()
  @Delete(':colorId')
  async delete(@Param('colorId') colorId: string) {
    return await this.colorService.delete(colorId);
  }
}
