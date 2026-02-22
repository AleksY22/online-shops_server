import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service.js';
import { StatisticsController } from './statistics.controller.js';
import { PrismaService } from '../prisma.service.js';

@Module({
  controllers: [StatisticsController],
  providers: [StatisticsService, PrismaService],
})
export class StatisticsModule {}
