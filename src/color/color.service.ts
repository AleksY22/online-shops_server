import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
import { ColorDto } from './dto/color.dto.js';

@Injectable()
export class ColorService {
  constructor(private prisma: PrismaService) {}

  //Получение цветов для конткретного магазина=========
  async getByStore(storeId: string) {
    return await this.prisma.color.findMany({
      where: {
        storeId,
      },
    });
  }

  //Получение цвета по id===============================
  async getById(colorId: string) {
    const color = await this.prisma.color.findUnique({
      where: {
        id: colorId,
      },
    });

    if (!color) throw new NotFoundException('Цвет не найден!');

    return color;
  }

  //Создание цвета========================================
  async create(storeId: string, dto: ColorDto) {
    return this.prisma.color.create({
      data: {
        name: dto.name,
        value: dto.value,
        storeId,
      },
    });
  }

  //Обновление цвета=======================================
  async update(colorId: string, dto: ColorDto) {
    await this.getById(colorId); //для проверки наличия цвета

    return this.prisma.color.update({
      where: {
        id: colorId,
      },
      data: {
        name: dto.name,
        value: dto.value,
      },
    });
  }

  //Удаление цвета===========================================
  async delete(colorId: string) {
    await this.getById(colorId); //для проверки наличия цвета

    return this.prisma.color.delete({
      where: {
        id: colorId,
      },
    });
  }
}
