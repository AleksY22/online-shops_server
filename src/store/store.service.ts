import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
import { CreateStoreDto } from './dto/create-store.dto.js';
import { UpdateStoreDto } from './dto/update-store.dto.js';

@Injectable()
export class StoreService {
  constructor(private prisma: PrismaService) {}

  //Получение магазина по id=============================
  async getById(storeId: string, userId: string) {
    const store = await this.prisma.store.findUnique({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!store)
      throw new NotFoundException(
        'Магазин не найден или вы не являетесь его владельцем!',
      );

    return store;
  }

  //Создание магазина====================================
  async create(userId: string, dto: CreateStoreDto) {
    return this.prisma.store.create({
      data: {
        title: dto.title,
        userId,
      },
    });
  }

  //Обновление магазина====================================
  async update(storeId: string, userId: string, dto: UpdateStoreDto) {
    await this.getById(storeId, userId);

    return this.prisma.store.update({
      where: {
        id: storeId,
      },
      data: {
        title: dto.title,
        description: dto.description,
        userId,
      },
    });
  }

  //Удаление магазина======================================
  async delete(storeId: string, userId: string) {
    await this.getById(storeId, userId);

    return this.prisma.store.delete({
      where: { id: storeId },
    });
  }
}
