import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Jenis, Kategori } from '@prisma/client';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async getDataFromPrisma(date: string) {
    console.log(date);
    return this.prisma.transaction.findMany();
  }

  async createTransaction(data: {
    tanggal: Date;
    nominal: number;
    keterangan: string;
    kategori: Kategori;
    jenis: Jenis;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    try {
      const result = await this.prisma.transaction.create({ data });
      return result;
    } catch (error) {
      console.log(error);
    }
  }
}
