import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { AppService } from './app.service';
import { Jenis, Kategori } from '@prisma/client';

@ApiTags('Transaction')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/transaction/:date')
  @ApiParam({
    name: 'date',
    required: true,
    example: '2025-02-06T10:15:30.000Z',
    description: 'Tanggal Transaksi',
  })
  async getPrismaData(@Param('date') date: Date) {
    return this.appService.getDataFromPrisma(date);
  }

  @Post('/transaction')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        tanggal: {
          type: 'string',
          format: 'date-time',
          example: '2025-02-06T10:15:30.000Z',
        },
        nominal: { type: 'number', example: 200000 },
        keterangan: { type: 'string', example: 'ditransfer masuk' },
        kategori: { type: 'string', example: 'TRANSFER' },
        jenis: { type: 'string', example: 'PENDAPATAN' },
        createdAt: {
          type: 'string',
          format: 'date-time',
          example: '2025-02-06T10:15:48.000Z',
        },
        updatedAt: {
          type: 'string',
          format: 'date-time',
          example: '2025-02-06T10:16:03.000Z',
        },
      },
      required: ['tanggal', 'nominal', 'keterangan', 'kategori', 'jenis'],
    },
  })
  async createTransaction(
    @Body()
    data: {
      tanggal: Date;
      nominal: number;
      keterangan: string;
      kategori: Kategori;
      jenis: Jenis;
      createdAt: Date;
      updatedAt: Date;
    },
  ) {
    return this.appService.createTransaction(data);
  }
}
