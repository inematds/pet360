import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VaccinesService {
  constructor(private prisma: PrismaService) {}

  async findAll(businessId: string, query?: any) {
    const { petId, vaccineType, page = 1, limit = 20 } = query || {};
    const where: any = { businessId };
    if (petId) where.petId = petId;
    if (vaccineType) where.vaccineType = vaccineType;

    const [vaccines, total] = await Promise.all([
      this.prisma.vaccineRecord.findMany({
        where,
        include: {
          pet: { select: { id: true, name: true, species: true, tutor: { select: { name: true, phone: true } } } },
          vet: { select: { id: true, name: true, crmv: true } },
        },
        orderBy: { applicationDate: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.vaccineRecord.count({ where }),
    ]);

    return { data: vaccines, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findPending(businessId: string, days: number = 30) {
    const futureDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    return this.prisma.vaccineRecord.findMany({
      where: {
        businessId,
        nextDoseDate: { lte: futureDate },
      },
      include: {
        pet: { include: { tutor: { select: { name: true, phone: true } } } },
      },
      orderBy: { nextDoseDate: 'asc' },
    });
  }

  async create(businessId: string, vetId: string, data: any) {
    return this.prisma.vaccineRecord.create({
      data: { ...data, businessId, vetId },
      include: { pet: true, vet: true },
    });
  }

  async update(id: string, businessId: string, data: any) {
    const vaccine = await this.prisma.vaccineRecord.findFirst({ where: { id, businessId } });
    if (!vaccine) throw new NotFoundException('Vacina nao encontrada');
    return this.prisma.vaccineRecord.update({ where: { id }, data });
  }

  async getVaccineCard(petId: string, businessId: string) {
    const pet = await this.prisma.pet.findFirst({
      where: { id: petId, businessId },
      include: {
        tutor: { select: { name: true, phone: true, email: true } },
        vaccineRecords: {
          orderBy: { applicationDate: 'desc' },
          include: { vet: { select: { name: true, crmv: true } } },
        },
      },
    });
    if (!pet) throw new NotFoundException('Pet nao encontrado');
    return pet;
  }
}
