import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BusinessesService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string) {
    const business = await this.prisma.business.findUnique({
      where: { id },
    });
    if (!business) {
      throw new NotFoundException('Negocio nao encontrado');
    }
    return business;
  }

  async findBySlug(slug: string) {
    return this.prisma.business.findUnique({
      where: { slug },
    });
  }

  async update(id: string, data: any) {
    await this.findOne(id);
    return this.prisma.business.update({
      where: { id },
      data,
    });
  }

  async updateSettings(id: string, settings: any) {
    await this.findOne(id);
    return this.prisma.business.update({
      where: { id },
      data: { settings },
    });
  }

  async getDashboardStats(id: string) {
    const [
      tutorsCount,
      petsCount,
      appointmentsToday,
      pendingVaccines,
      activeBoarding,
      monthRevenue,
    ] = await Promise.all([
      this.prisma.tutor.count({ where: { businessId: id } }),
      this.prisma.pet.count({ where: { businessId: id, isActive: true } }),
      this.prisma.appointment.count({
        where: {
          businessId: id,
          scheduledDate: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999)),
          },
        },
      }),
      this.prisma.vaccineRecord.count({
        where: {
          businessId: id,
          nextDoseDate: {
            lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      this.prisma.boarding.count({
        where: {
          businessId: id,
          status: 'CHECKED_IN',
        },
      }),
      this.prisma.sale.aggregate({
        where: {
          businessId: id,
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
        _sum: { totalAmount: true },
      }),
    ]);

    return {
      tutorsCount,
      petsCount,
      appointmentsToday,
      pendingVaccines,
      activeBoarding,
      monthRevenue: monthRevenue._sum.totalAmount || 0,
    };
  }
}
