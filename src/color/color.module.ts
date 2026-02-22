import { Module } from '@nestjs/common';
import { ColorService } from './color.service.js';
import { ColorController } from './color.controller.js';
import { PrismaService } from '../prisma.service.js';

@Module({
  controllers: [ColorController],
  providers: [ColorService, PrismaService],
})
export class ColorModule {}
