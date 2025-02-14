import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Headers,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { AppService } from './app.service';
import { Jenis, Kategori } from '@prisma/client';

@ApiTags('Transaction')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Middleware to check for secretKey
  private validateSecretKey(secretKey: string) {
    const validSecretKey = 'myfinance2025'; // Replace with your actual secret key
    if (secretKey !== validSecretKey) {
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Invalid or missing secret key',
      });
    }
  }

  @Get('/transaction/:date')
  @ApiParam({
    name: 'date',
    required: true,
    example: '2025-02-06T10:15:30.000Z',
    description: 'Tanggal Transaksi',
  })
  @ApiResponse({
    status: 200,
    description: 'Data transaksi berhasil diambil.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          tanggal: { type: 'string', format: 'date-time' },
          nominal: { type: 'number' },
          keterangan: { type: 'string' },
          kategori: { type: 'string' },
          jenis: { type: 'string' },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Secret key tidak valid atau tidak ada.',
  })
  async getPrismaData(
    @Param('date') date: Date,
    @Headers('secretkey') secretKey: string,
  ) {
    this.validateSecretKey(secretKey);
    const data = await this.appService.getDataFromPrisma(date);
    if (!data) {
      throw new HttpException(
        'Data transaksi tidak ditemukan',
        HttpStatus.NOT_FOUND,
      );
    }
    return {
      status: 'success',
      message: 'Data transaksi berhasil diambil',
      data,
    };
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
  @ApiResponse({
    status: 201,
    description: 'Transaksi berhasil dibuat.',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'success' },
        message: { type: 'string', example: 'Transaksi berhasil dibuat' },
        data: {
          type: 'object',
          properties: {
            tanggal: { type: 'string', format: 'date-time' },
            nominal: { type: 'number' },
            keterangan: { type: 'string' },
            kategori: { type: 'string' },
            jenis: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Permintaan tidak valid.',
  })
  @ApiResponse({
    status: 401,
    description: 'Secret key tidak valid atau tidak ada.',
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
    @Headers('secretkey') secretKey: string,
  ) {
    this.validateSecretKey(secretKey);

    // Simulating possible validation errors (e.g., missing fields)
    if (
      !data.tanggal ||
      !data.nominal ||
      !data.keterangan ||
      !data.kategori ||
      !data.jenis
    ) {
      throw new HttpException(
        'Data yang dikirim tidak lengkap',
        HttpStatus.BAD_REQUEST,
      );
    }

    const transaction = await this.appService.createTransaction(data);
    return {
      status: 'success',
      message: 'Transaksi berhasil dibuat',
      data: transaction,
    };
  }

  @Get('/')
  async testEndpoint() {
    return {
      status: 'success',
      message: 'Server berjalan dengan baik!',
    };
  }
}
