import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/transaction/:date')
  async getPrismaData(@Param('date') date: string) {
    return this.appService.getDataFromPrisma(date);
  }
}
