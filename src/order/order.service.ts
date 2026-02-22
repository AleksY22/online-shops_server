import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
import { ICapturePayment, YooCheckout } from '@a2seven/yoo-checkout';
import { OrderDto } from './dto/order.dto.js';
import 'dotenv/config';
import { PaymentStatusDto } from './dto/payment-status.dto.js';
import { OrderStatus } from '../generated/prisma/client.js';

const checkout = new YooCheckout({
  shopId: process.env['YOOKASSA_SHOP_ID'] as string,
  secretKey: process.env['YOOKASSA_API_KEY'] as string,
});

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  //Создание заказа=============================
  async createPayment(dto: OrderDto, userId: string) {
    const orderItems = dto.items.map((item) => ({
      quantity: item.quantity,
      price: item.price,
      product: {
        connect: {
          id: item.productId,
        },
      },
      store: {
        connect: {
          id: item.storeId,
        },
      },
    }));

    //Цена
    const total = dto.items.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);

    //Создание заказа
    const order = await this.prisma.order.create({
      data: {
        status: dto.status,
        items: {
          create: orderItems,
        },
        total,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    //Создание платежа
    const payment = await checkout.createPayment({
      amount: {
        value: total.toFixed(2),
        currency: 'RUB',
      },
      payment_method_data: {
        type: 'bank_card',
      },
      confirmation: {
        type: 'redirect',
        return_url: `${process.env.CLIENT_URL}/thanks`,
      },
      description: `Оплата заказа в магазине Online-Shops. Id платежа: #${order.id}`,
    });

    return payment;
  }

  //Обновление статуса заказа===========================
  async updateStatus(dto: PaymentStatusDto) {
    if (dto.event === 'payment.waiting_for_capture') {
      const capturePayment: ICapturePayment = {
        amount: {
          value: dto.object.amount.value,
          currency: dto.object.amount.currency,
        },
      };

      return checkout.capturePayment(dto.object.id, capturePayment);
    }

    if (dto.event === 'payment.succeeded') {
      const orderId = dto.object.description.split('#')[1];

      await this.prisma.order.update({
        where: {
          id: orderId,
        },
        data: {
          status: OrderStatus.SUCCEEDING,
        },
      });

      return true;
    }

    return true;
  }
}
