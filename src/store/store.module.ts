import { Module } from '@nestjs/common';
import { StoreService } from './store.service.js';
import { StoreController } from './store.controller.js';
import { PrismaService } from '../prisma.service.js';

@Module({
  controllers: [StoreController],
  providers: [StoreService, PrismaService],
})
export class StoreModule {}
