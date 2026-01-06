import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';

@Injectable()
export class PetsService {
  constructor(private prisma: PrismaService) {}

  async findAll(businessId: string, query?: any) {
    const { search, species, tutorId, page = 1, limit = 20 } = query || {};

    const where: any = { businessId, isActive: true };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { breed: { contains: search, mode: 'insensitive' } },
        { microchipNumber: { contains: search } },
      ];
    }

    if (species) {
      where.species = species;
    }

    if (tutorId) {
      where.tutorId = tutorId;
    }

    const [pets, total] = await Promise.all([
      this.prisma.pet.findMany({
        where,
        include: {
          tutor: {
            select: { id: true, name: true, phone: true },
          },
          _count: {
            select: { appointments: true, vaccineRecords: true, medicalRecords: true },
          },
        },
        orderBy: { name: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.pet.count({ where }),
    ]);

    return {
      data: pets,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, businessId: string) {
    const pet = await this.prisma.pet.findFirst({
      where: { id, businessId },
      include: {
        tutor: true,
        vaccineRecords: {
          orderBy: { applicationDate: 'desc' },
          include: { vet: { select: { id: true, name: true } } },
        },
        medicalRecords: {
          orderBy: { recordDate: 'desc' },
          take: 10,
          include: { vet: { select: { id: true, name: true } } },
        },
        appointments: {
          orderBy: { scheduledDate: 'desc' },
          take: 10,
          include: { service: true, professional: { select: { id: true, name: true } } },
        },
        adoptionProfile: true,
      },
    });

    if (!pet) {
      throw new NotFoundException('Pet nao encontrado');
    }

    return pet;
  }

  async create(businessId: string, dto: CreatePetDto) {
    return this.prisma.pet.create({
      data: {
        ...dto,
        businessId,
      },
      include: { tutor: true },
    });
  }

  async update(id: string, businessId: string, dto: UpdatePetDto) {
    await this.findOne(id, businessId);
    return this.prisma.pet.update({
      where: { id },
      data: dto,
      include: { tutor: true },
    });
  }

  async delete(id: string, businessId: string) {
    await this.findOne(id, businessId);
    return this.prisma.pet.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async getVaccineCard(id: string, businessId: string) {
    const pet = await this.prisma.pet.findFirst({
      where: { id, businessId },
      include: {
        tutor: { select: { name: true, phone: true } },
        vaccineRecords: {
          orderBy: { applicationDate: 'desc' },
          include: { vet: { select: { name: true, crmv: true } } },
        },
      },
    });

    if (!pet) {
      throw new NotFoundException('Pet nao encontrado');
    }

    const pendingVaccines = pet.vaccineRecords.filter(
      (v) => v.nextDoseDate && new Date(v.nextDoseDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    );

    return {
      pet: {
        id: pet.id,
        name: pet.name,
        species: pet.species,
        breed: pet.breed,
        birthDate: pet.birthDate,
        photoUrl: pet.photoUrl,
      },
      tutor: pet.tutor,
      vaccines: pet.vaccineRecords,
      pendingVaccines,
    };
  }

  async getMedicalHistory(id: string, businessId: string) {
    const pet = await this.findOne(id, businessId);

    const records = await this.prisma.medicalRecord.findMany({
      where: { petId: id },
      orderBy: { recordDate: 'desc' },
      include: {
        vet: { select: { id: true, name: true, crmv: true } },
        prescriptions: true,
      },
    });

    return {
      pet,
      records,
    };
  }
}
