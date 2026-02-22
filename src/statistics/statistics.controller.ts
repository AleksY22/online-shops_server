import { Controller, Get, Param } from '@nestjs/common';
import { StatisticsService } from './statistics.service.js';
import { Auth } from '../auth/decorators/auth.decorator.js';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Auth()
  @Get('main/:storeId')
  async getMainStatistics(@Param('storeId') storeId: string) {
    return await this.statisticsService.getMainStatistics(storeId);
  }

  @Auth()
  @Get('middle/:storeId')
  async getMiddleStatistics(@Param('storeId') storeId: string) {
    return await this.statisticsService.getMiddleStatistics(storeId);
  }
}
