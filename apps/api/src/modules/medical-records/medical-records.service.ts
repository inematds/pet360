import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MedicalRecordsService {
  constructor(private prisma: PrismaService) {}

  async findAll(businessId: string, query?: any) {
    const { petId, vetId, recordType, page = 1, limit = 20 } = query || {};
    const where: any = { businessId };
    if (petId) where.petId = petId;
    if (vetId) where.vetId = vetId;
    if (recordType) where.recordType = recordType;

    const [records, total] = await Promise.all([
      this.prisma.medicalRecord.findMany({
        where,
        include: {
          pet: { select: { id: true, name: true, species: true, photoUrl: true } },
          vet: { select: { id: true, name: true, crmv: true } },
          prescriptions: true,
        },
        orderBy: { recordDate: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.medicalRecord.count({ where }),
    ]);

    return { data: records, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string, businessId: string) {
    const record = await this.prisma.medicalRecord.findFirst({
      where: { id, businessId },
      include: { pet: true, vet: true, prescriptions: true, appointment: true },
    });
    if (!record) throw new NotFoundException('Prontuario nao encontrado');
    return record;
  }

  async create(businessId: string, vetId: string, data: any) {
    const { prescriptions, ...recordData } = data;
    return this.prisma.medicalRecord.create({
      data: {
        ...recordData,
        businessId,
        vetId,
        prescriptions: prescriptions ? { create: prescriptions } : undefined,
      },
      include: { pet: true, vet: true, prescriptions: true },
    });
  }

  async update(id: string, businessId: string, data: any) {
    await this.findOne(id, businessId);
    return this.prisma.medicalRecord.update({
      where: { id },
      data,
      include: { pet: true, vet: true, prescriptions: true },
    });
  }
}
