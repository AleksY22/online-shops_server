import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module.js';
import { UserModule } from './user/user.module.js';
import { ColorModule } from './color/color.module.js';
import { CategoryModule } from './category/category.module.js';
import { FileModule } from './file/file.module.js';
import { StoreModule } from './store/store.module.js';
import { OrderModule } from './order/order.module.js';
import { StatisticsModule } from './statistics/statistics.module.js';
import { ProductModule } from './product/product.module.js';
import { ReviewModule } from './review/review.module.js';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    UserModule,
    ColorModule,
    CategoryModule,
    FileModule,
    StoreModule,
    OrderModule,
    StatisticsModule,
    ProductModule,
    ReviewModule,
  ],
})
export class AppModule {}
