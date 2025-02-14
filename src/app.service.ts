import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async getDataFromPrisma(date: string) {
    console.log(date);
    return this.prisma.transaction.findMany();
  }
}
