import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getDashboard(businessId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

    const [
      totalTutors,
      totalPets,
      todayAppointments,
      monthRevenue,
      lastMonthRevenue,
      pendingVaccines,
      activeBoarding,
    ] = await Promise.all([
      this.prisma.tutor.count({ where: { businessId } }),
      this.prisma.pet.count({ where: { businessId, isActive: true } }),
      this.prisma.appointment.count({ where: { businessId, scheduledDate: today } }),
      this.prisma.sale.aggregate({ where: { businessId, createdAt: { gte: monthStart } }, _sum: { totalAmount: true } }),
      this.prisma.sale.aggregate({ where: { businessId, createdAt: { gte: lastMonth, lt: monthStart } }, _sum: { totalAmount: true } }),
      this.prisma.vaccineRecord.count({ where: { businessId, nextDoseDate: { lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) } } }),
      this.prisma.boarding.count({ where: { businessId, status: 'CHECKED_IN' } }),
    ]);

    const currentRevenue = Number(monthRevenue._sum.totalAmount) || 0;
    const previousRevenue = Number(lastMonthRevenue._sum.totalAmount) || 0;
    const revenueGrowth = previousRevenue > 0 ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0;

    return {
      totalTutors,
      totalPets,
      todayAppointments,
      monthRevenue: currentRevenue,
      revenueGrowth: revenueGrowth.toFixed(1),
      pendingVaccines,
      activeBoarding,
    };
  }

  async getAppointmentsMetrics(businessId: string, startDate: string, endDate: string) {
    const appointments = await this.prisma.appointment.groupBy({
      by: ['status'],
      where: { businessId, scheduledDate: { gte: new Date(startDate), lte: new Date(endDate) } },
      _count: true,
    });

    const byType = await this.prisma.appointment.groupBy({
      by: ['appointmentType'],
      where: { businessId, scheduledDate: { gte: new Date(startDate), lte: new Date(endDate) } },
      _count: true,
    });

    return { byStatus: appointments, byType };
  }

  async getPetsMetrics(businessId: string) {
    const bySpecies = await this.prisma.pet.groupBy({
      by: ['species'],
      where: { businessId, isActive: true },
      _count: true,
    });

    const bySize = await this.prisma.pet.groupBy({
      by: ['size'],
      where: { businessId, isActive: true, size: { not: null } },
      _count: true,
    });

    return { bySpecies, bySize };
  }

  async getRevenueMetrics(businessId: string, year: number) {
    const monthly = [];
    for (let month = 0; month < 12; month++) {
      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 0);

      const result = await this.prisma.sale.aggregate({
        where: { businessId, createdAt: { gte: startDate, lte: endDate } },
        _sum: { totalAmount: true },
      });

      monthly.push({ month: month + 1, revenue: result._sum.totalAmount || 0 });
    }
    return monthly;
  }

  async getTopServices(businessId: string, limit: number = 10) {
    return this.prisma.appointment.groupBy({
      by: ['serviceId'],
      where: { businessId, status: 'COMPLETED' },
      _count: true,
      orderBy: { _count: { serviceId: 'desc' } },
      take: limit,
    });
  }

  async getTopProducts(businessId: string, limit: number = 10) {
    return this.prisma.saleItem.groupBy({
      by: ['productId'],
      where: { sale: { businessId }, itemType: 'PRODUCT', productId: { not: null } },
      _sum: { quantity: true, totalPrice: true },
      orderBy: { _sum: { totalPrice: 'desc' } },
      take: limit,
    });
  }
}
