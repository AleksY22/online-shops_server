import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { OrderStatus } from '../../generated/prisma/client.js';
import { Type } from 'class-transformer';

export class OrderDto {
  //======================================
  @IsOptional()
  @IsEnum(OrderStatus, {
    message: 'Статус заказа обязателен!',
  })
  status: OrderStatus;

  //======================================
  @IsArray({ message: 'В заказе нет товаров!' })
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
export class OrderItemDto {
  //=======================================
  @IsNumber({}, { message: 'Количество должно быть числом!' })
  quantity: number;

  //========================================
  @IsNumber({}, { message: 'Цена должна быть числом!' })
  price: number;

  //========================================
  @IsString({ message: 'Значение для товара должно быть строкой!' })
  productId: string;

  //=========================================
  @IsString({ message: 'Значение для магазина должно быть строкой!' })
  storeId: string;
}
