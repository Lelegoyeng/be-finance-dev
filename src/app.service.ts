import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Jenis, Kategori } from '@prisma/client';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async getDataFromPrisma(date: Date) {
    const tanggal = new Date(date);

    const awalBulanSaatIni = new Date(
      tanggal.getFullYear(),
      tanggal.getMonth(),
      1,
    );
    const akhirBulanSaatIni = new Date(
      tanggal.getFullYear(),
      tanggal.getMonth() + 1,
      0,
    );

    const summary = await this.prisma.summary.aggregate({
      _sum: {
        nominal: true,
      },
      where: {
        date: {
          lt: awalBulanSaatIni,
        },
      },
    });

    const pendapatan = await this.prisma.transaction.aggregate({
      _sum: {
        nominal: true,
      },
      where: {
        tanggal: {
          gte: awalBulanSaatIni,
          lte: akhirBulanSaatIni,
        },
        jenis: 'PENDAPATAN',
      },
    });

    const pengeluaran = await this.prisma.transaction.aggregate({
      _sum: {
        nominal: true,
      },
      where: {
        tanggal: {
          gte: awalBulanSaatIni,
          lte: akhirBulanSaatIni,
        },
        jenis: 'PENGELUARAN',
      },
    });

    // Mengambil semua data transaksi
    const hasil = {
      tanggal: tanggal,
      bulanlalu: summary ? summary._sum.nominal || 0 : 0,
      pendapatan: pendapatan._sum.nominal || 0,
      pengeluaran: pengeluaran._sum.nominal || 0,
      total:
        (summary ? summary._sum.nominal || 0 : 0) +
        (pendapatan._sum.nominal || 0) -
        (pengeluaran._sum.nominal || 0),
      rows: await this.prisma.transaction.findMany({
        where: {
          tanggal: {
            gte: awalBulanSaatIni,
            lte: akhirBulanSaatIni,
          },
        },
      }),
    };

    return hasil;
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
      const insertTransaction = await this.prisma.transaction.create({ data });

      if (insertTransaction) {
        const tanggal = new Date(data.tanggal);

        const checkSummaryExisting = await this.prisma.summary.findFirst({
          where: {
            AND: [
              {
                date: {
                  gte: new Date(tanggal.getFullYear(), tanggal.getMonth(), 1),
                },
              },
              {
                date: {
                  lt: new Date(
                    tanggal.getFullYear(),
                    tanggal.getMonth() + 1,
                    1,
                  ),
                },
              },
            ],
          },
        });

        const nominalBulanSebelumnya = checkSummaryExisting
          ? checkSummaryExisting.nominal
          : 0;
        const nominal =
          data.jenis == 'PENDAPATAN'
            ? nominalBulanSebelumnya + data.nominal
            : nominalBulanSebelumnya - data.nominal;

        if (!checkSummaryExisting) {
          await this.prisma.summary.create({
            data: {
              nominal: nominal,
              date: tanggal,
            },
          });
        }
        if (checkSummaryExisting) {
          await this.prisma.summary.update({
            where: {
              id: checkSummaryExisting.id,
            },
            data: {
              nominal: nominal,
            },
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
}
