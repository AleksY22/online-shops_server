import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
import { ProductDto } from './dto/product.dto.js';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  //Получение всех товаров============================
  async getAll(searchTerm?: string) {
    if (searchTerm) return this.getSearchTermFilter(searchTerm);

    return await this.prisma.product.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        category: true,
      },
    });
  }

  //Функция поиска=======================================
  private async getSearchTermFilter(searchTerm: string) {
    return await this.prisma.product.findMany({
      where: {
        OR: [
          {
            title: {
              contains: searchTerm,
              //не зависит от регистра
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: searchTerm,
              //не зависит от регистра
              mode: 'insensitive',
            },
          },
        ],
      },
      include: {
        category: true,
      },
    });
  }

  //Получение товаров для конткретного магазина=========
  async getByStore(storeId: string) {
    return await this.prisma.product.findMany({
      where: {
        storeId,
      },
      include: {
        category: true,
        color: true,
      },
    });
  }

  //Получение товара по id===============================
  async getById(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        category: true,
        color: true,
        reviews: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!product) throw new NotFoundException('Товар не найден!');

    return product;
  }

  //Получение товаров по категории=========================
  async getByCategory(categoryId: string) {
    const products = await this.prisma.product.findMany({
      // where: {
      //    category: {
      //       id: categoryId
      //    }
      // }
      where: {
        categoryId,
      },
      include: {
        category: true,
      },
    });

    if (!products) throw new NotFoundException('Товары не найдены!');

    return products;
  }

  //Получение популярных товаров==============================
  async getMostPopular() {
    const mostPopularProducts = await this.prisma.orderItem.groupBy({
      by: ['productId'],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
    });

    if (!mostPopularProducts) throw new NotFoundException('Товары не найдены!');

    const productIds = mostPopularProducts.map((item) => item.productId);

    const products = await this.prisma.product.findMany({
      where: {
        id: {
          in: productIds as string[],
        },
      },
      include: {
        category: true,
      },
    });

    return products;
  }

  //Получение похожих товаров===========================
  async getSimilar(id: string) {
    const currentProduct = await this.getById(id);

    if (!currentProduct)
      throw new NotFoundException('Текущий товар не найден!');

    const products = await this.prisma.product.findMany({
      where: {
        category: {
          title: currentProduct.category?.title,
        },
        NOT: {
          id: currentProduct.id,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        category: true,
      },
    });

    return products;
  }

  //Создание товара========================================
  async create(storeId: string, dto: ProductDto) {
    return this.prisma.product.create({
      data: {
        title: dto.title,
        description: dto.description,
        price: dto.price,
        images: dto.images,
        categoryId: dto.categoryId,
        colorId: dto.colorId,
        storeId,
      },
    });
  }

  //Обновление товара=======================================
  async update(productId: string, dto: ProductDto) {
    await this.getById(productId); //для проверки наличия товара

    return this.prisma.product.update({
      where: {
        id: productId,
      },
      data: dto,
    });
  }

  //Удаление товара===========================================
  async delete(productId: string) {
    await this.getById(productId); //для проверки наличия товара

    return this.prisma.product.delete({
      where: {
        id: productId,
      },
    });
  }
}
