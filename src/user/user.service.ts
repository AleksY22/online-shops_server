import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
import { hash } from '@node-rs/argon2';
import { AuthDto } from '../auth/dto/auth.dto.js';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  //===================================================
  async getById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        stores: true,
        favorites: {
          include: {
            category: true,
          },
        },
        orders: true,
      },
    });

    return user;
  }

  //====================================================
  async getByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        stores: true,
        favorites: true,
        orders: true,
      },
    });

    return user;
  }

  //Добавление в избранное===================================
  async toggleFavorite(productId: string, userId: string) {
    const user = await this.getById(userId);

    //Проверка существования данного товара в избранных
    const isExists = user?.favorites.some(
      (product) => product.id === productId,
    );

    await this.prisma.user.update({
      where: {
        id: user?.id,
      },
      data: {
        favorites: {
          [isExists ? 'disconnect' : 'connect']: {
            id: productId,
          },
        },
      },
    });

    return true;
  }

  //Создание пользователя==================================
  async create(dto: AuthDto) {
    return this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: await hash(dto.password),
      },
    });
  }
}
