import { Controller, Get, Param, Patch } from '@nestjs/common';
import { UserService } from './user.service.js';
import { Auth } from '../auth/decorators/auth.decorator.js';
import { CurrentUser } from './decorators/user.decorator.js';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //Получение профиля======================================
  @Auth()
  @Get('profile')
  async getProfile(@CurrentUser('id') id: string) {
    return this.userService.getById(id);
  }

  //Добавление в избранное=================================
  @Auth()
  @Patch('profile/favorites/:productId')
  async toggleFavorite(
    @CurrentUser('id') userId: string,
    @Param('productId') productId: string,
  ) {
    return await this.userService.toggleFavorite(productId, userId);
  }
}
