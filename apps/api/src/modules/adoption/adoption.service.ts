import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdoptionService {
  constructor(private prisma: PrismaService) {}

  async findAllAnimals(businessId: string, query?: any) {
    const { species, status = 'AVAILABLE', page = 1, limit = 20 } = query || {};
    const where: any = { businessId };
    if (status) where.status = status;
    if (species) where.pet = { species };

    const [animals, total] = await Promise.all([
      this.prisma.adoptionAnimal.findMany({
        where,
        include: { pet: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.adoptionAnimal.count({ where }),
    ]);
    return { data: animals, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findOneAnimal(id: string, businessId: string) {
    const animal = await this.prisma.adoptionAnimal.findFirst({
      where: { id, businessId },
      include: { pet: true, adoptions: { include: { tutor: true } }, inquiries: true },
    });
    if (!animal) throw new NotFoundException('Animal nao encontrado');
    return animal;
  }

  async createAnimal(businessId: string, data: any) {
    const { petData, ...adoptionData } = data;
    const pet = await this.prisma.pet.create({ data: { ...petData, businessId } });
    return this.prisma.adoptionAnimal.create({
      data: { ...adoptionData, businessId, petId: pet.id },
      include: { pet: true },
    });
  }

  async updateAnimal(id: string, businessId: string, data: any) {
    await this.findOneAnimal(id, businessId);
    return this.prisma.adoptionAnimal.update({ where: { id }, data, include: { pet: true } });
  }

  async createInquiry(adoptionAnimalId: string, data: any) {
    await this.prisma.adoptionAnimal.update({
      where: { id: adoptionAnimalId },
      data: { inquiryCount: { increment: 1 } },
    });
    return this.prisma.adoptionInquiry.create({ data: { ...data, adoptionAnimalId } });
  }

  async createAdoption(businessId: string, data: any) {
    return this.prisma.adoption.create({
      data,
      include: { adoptionAnimal: { include: { pet: true } }, tutor: true },
    });
  }

  async updateAdoption(id: string, data: any) {
    return this.prisma.adoption.update({ where: { id }, data });
  }

  async completeAdoption(id: string, tutorId: string) {
    const adoption = await this.prisma.adoption.findUnique({
      where: { id },
      include: { adoptionAnimal: true },
    });
    if (!adoption) throw new NotFoundException('Adocao nao encontrada');

    await this.prisma.$transaction([
      this.prisma.adoption.update({
        where: { id },
        data: { stage: 'COMPLETED', adoptionDate: new Date() },
      }),
      this.prisma.adoptionAnimal.update({
        where: { id: adoption.adoptionAnimalId },
        data: { status: 'ADOPTED', adoptedDate: new Date() },
      }),
      this.prisma.pet.update({
        where: { id: adoption.adoptionAnimal.petId },
        data: { tutorId },
      }),
    ]);

    return { success: true };
  }
}
