import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FinanceService {
  constructor(private prisma: PrismaService) {}

  async getDashboard(businessId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const [todaySales, monthSales, topProducts, topServices] = await Promise.all([
      this.prisma.sale.aggregate({
        where: { businessId, createdAt: { gte: today } },
        _sum: { totalAmount: true },
        _count: true,
      }),
      this.prisma.sale.aggregate({
        where: { businessId, createdAt: { gte: monthStart } },
        _sum: { totalAmount: true },
        _count: true,
      }),
      this.prisma.saleItem.groupBy({
        by: ['description'],
        where: { sale: { businessId, createdAt: { gte: monthStart } }, itemType: 'PRODUCT' },
        _sum: { totalPrice: true, quantity: true },
        orderBy: { _sum: { totalPrice: 'desc' } },
        take: 5,
      }),
      this.prisma.saleItem.groupBy({
        by: ['description'],
        where: { sale: { businessId, createdAt: { gte: monthStart } }, itemType: 'SERVICE' },
        _sum: { totalPrice: true, quantity: true },
        orderBy: { _sum: { totalPrice: 'desc' } },
        take: 5,
      }),
    ]);

    return {
      today: { revenue: todaySales._sum.totalAmount || 0, count: todaySales._count },
      month: { revenue: monthSales._sum.totalAmount || 0, count: monthSales._count },
      topProducts,
      topServices,
    };
  }

  async getCashRegister(businessId: string, date: Date) {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    let register = await this.prisma.cashRegister.findFirst({
      where: { businessId, date: targetDate },
    });

    if (!register) {
      register = await this.prisma.cashRegister.create({
        data: { businessId, date: targetDate },
      });
    }

    const sales = await this.prisma.sale.findMany({
      where: {
        businessId,
        createdAt: {
          gte: targetDate,
          lt: new Date(targetDate.getTime() + 24 * 60 * 60 * 1000),
        },
      },
      include: { items: true },
    });

    return { register, sales };
  }

  async closeCashRegister(businessId: string, date: Date, userId: string, notes?: string) {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    const sales = await this.prisma.sale.findMany({
      where: {
        businessId,
        createdAt: {
          gte: targetDate,
          lt: new Date(targetDate.getTime() + 24 * 60 * 60 * 1000),
        },
      },
    });

    const totals = sales.reduce(
      (acc, sale) => {
        acc.total += Number(sale.totalAmount);
        switch (sale.paymentMethod) {
          case 'CASH': acc.cash += Number(sale.totalAmount); break;
          case 'PIX': acc.pix += Number(sale.totalAmount); break;
          case 'CREDIT_CARD': acc.credit += Number(sale.totalAmount); break;
          case 'DEBIT_CARD': acc.debit += Number(sale.totalAmount); break;
        }
        return acc;
      },
      { total: 0, cash: 0, pix: 0, credit: 0, debit: 0 },
    );

    return this.prisma.cashRegister.upsert({
      where: { businessId_date: { businessId, date: targetDate } },
      update: {
        cashTotal: totals.cash,
        pixTotal: totals.pix,
        creditTotal: totals.credit,
        debitTotal: totals.debit,
        totalRevenue: totals.total,
        netAmount: totals.total,
        salesCount: sales.length,
        isClosed: true,
        closedAt: new Date(),
        closedById: userId,
        notes,
      },
      create: {
        businessId,
        date: targetDate,
        cashTotal: totals.cash,
        pixTotal: totals.pix,
        creditTotal: totals.credit,
        debitTotal: totals.debit,
        totalRevenue: totals.total,
        netAmount: totals.total,
        salesCount: sales.length,
        isClosed: true,
        closedAt: new Date(),
        closedById: userId,
        notes,
      },
    });
  }

  async getReportDaily(businessId: string, startDate: string, endDate: string) {
    return this.prisma.cashRegister.findMany({
      where: {
        businessId,
        date: { gte: new Date(startDate), lte: new Date(endDate) },
      },
      orderBy: { date: 'desc' },
    });
  }

  async getReportMonthly(businessId: string, year: number) {
    const reports = [];
    for (let month = 0; month < 12; month++) {
      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 0);

      const result = await this.prisma.sale.aggregate({
        where: {
          businessId,
          createdAt: { gte: startDate, lte: endDate },
        },
        _sum: { totalAmount: true },
        _count: true,
      });

      reports.push({
        month: month + 1,
        revenue: result._sum.totalAmount || 0,
        count: result._count,
      });
    }
    return reports;
  }
}
