import {
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { OrderService } from './order.service.js';
import { OrderDto } from './dto/order.dto.js';
import { CurrentUser } from '../user/decorators/user.decorator.js';
import { Auth } from '../auth/decorators/auth.decorator.js';
import { PaymentStatusDto } from './dto/payment-status.dto.js';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  //Создание платежа====================================
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('place')
  @Auth()
  async checkout(@Body() dto: OrderDto, @CurrentUser('id') userId: string) {
    return await this.orderService.createPayment(dto, userId);
  }

  //Обновление статуса заказа===========================
  @HttpCode(200)
  @Post('status')
  async updateStatus(@Body() dto: PaymentStatusDto) {
    return await this.orderService.updateStatus(dto);
  }
}
