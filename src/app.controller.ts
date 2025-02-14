import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('Transaction')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/transaction/:date')
  @ApiParam({
    name: 'date',
    required: true,
    example: '2024-02-14',
    description: 'Tanggal Transaksi',
  })
  async getPrismaData(@Param('date') date: string) {
    return this.appService.getDataFromPrisma(date);
  }
}
