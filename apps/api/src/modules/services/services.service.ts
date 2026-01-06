import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async findAll(businessId: string, query?: any) {
    const { category, isActive } = query || {};
    const where: any = { businessId };
    if (category) where.category = category;
    if (isActive !== undefined) where.isActive = isActive === 'true';

    return this.prisma.service.findMany({
      where,
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    });
  }

  async findOne(id: string, businessId: string) {
    const service = await this.prisma.service.findFirst({
      where: { id, businessId },
    });
    if (!service) throw new NotFoundException('Servico nao encontrado');
    return service;
  }

  async create(businessId: string, data: any) {
    return this.prisma.service.create({
      data: { ...data, businessId },
    });
  }

  async update(id: string, businessId: string, data: any) {
    await this.findOne(id, businessId);
    return this.prisma.service.update({ where: { id }, data });
  }

  async delete(id: string, businessId: string) {
    await this.findOne(id, businessId);
    return this.prisma.service.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
