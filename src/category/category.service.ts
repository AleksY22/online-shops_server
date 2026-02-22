import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
import { CategoryDto } from './dto/category.dto.js';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  //Получение категорий для конткретного магазина=========
  async getByStore(storeId: string) {
    return await this.prisma.category.findMany({
      where: {
        storeId,
      },
    });
  }

  //Получение категории по id===============================
  async getById(categoryId: string) {
    const category = await this.prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category) throw new NotFoundException('Категория не найдена!');

    return category;
  }

  //Создание категории======================================
  async create(storeId: string, dto: CategoryDto) {
    return this.prisma.category.create({
      data: {
        title: dto.title,
        description: dto.description,
        storeId,
      },
    });
  }

  //Обновление категории=====================================
  async update(categoryId: string, dto: CategoryDto) {
    await this.getById(categoryId); //для проверки наличия категории

    return this.prisma.category.update({
      where: {
        id: categoryId,
      },
      data: {
        title: dto.title,
        description: dto.description,
      },
    });
  }

  //Удаление категории========================================
  async delete(categoryId: string) {
    await this.getById(categoryId); //для проверки наличия категории

    return this.prisma.category.delete({
      where: {
        id: categoryId,
      },
    });
  }
}
