import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTutorDto } from './dto/create-tutor.dto';
import { UpdateTutorDto } from './dto/update-tutor.dto';

@Injectable()
export class TutorsService {
  constructor(private prisma: PrismaService) {}

  async findAll(businessId: string, query?: any) {
    const { search, page = 1, limit = 20 } = query || {};

    const where: any = { businessId };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
        { email: { contains: search, mode: 'insensitive' } },
        { cpf: { contains: search } },
      ];
    }

    const [tutors, total] = await Promise.all([
      this.prisma.tutor.findMany({
        where,
        include: {
          pets: {
            where: { isActive: true },
            select: { id: true, name: true, species: true, photoUrl: true },
          },
          _count: { select: { pets: true, appointments: true } },
        },
        orderBy: { name: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.tutor.count({ where }),
    ]);

    return {
      data: tutors,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, businessId: string) {
    const tutor = await this.prisma.tutor.findFirst({
      where: { id, businessId },
      include: {
        pets: {
          where: { isActive: true },
          include: {
            vaccineRecords: {
              orderBy: { applicationDate: 'desc' },
              take: 5,
            },
          },
        },
        appointments: {
          orderBy: { scheduledDate: 'desc' },
          take: 10,
          include: {
            pet: true,
            service: true,
          },
        },
        sales: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!tutor) {
      throw new NotFoundException('Tutor nao encontrado');
    }

    return tutor;
  }

  async create(businessId: string, dto: CreateTutorDto) {
    if (dto.cpf) {
      const existing = await this.prisma.tutor.findFirst({
        where: { businessId, cpf: dto.cpf },
      });
      if (existing) {
        throw new ConflictException('CPF ja cadastrado');
      }
    }

    return this.prisma.tutor.create({
      data: {
        ...dto,
        businessId,
      },
    });
  }

  async update(id: string, businessId: string, dto: UpdateTutorDto) {
    await this.findOne(id, businessId);

    if (dto.cpf) {
      const existing = await this.prisma.tutor.findFirst({
        where: { businessId, cpf: dto.cpf, NOT: { id } },
      });
      if (existing) {
        throw new ConflictException('CPF ja cadastrado');
      }
    }

    return this.prisma.tutor.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: string, businessId: string) {
    await this.findOne(id, businessId);
    return this.prisma.tutor.delete({ where: { id } });
  }

  async getHistory(id: string, businessId: string) {
    const tutor = await this.findOne(id, businessId);

    const [appointments, sales, boardings] = await Promise.all([
      this.prisma.appointment.findMany({
        where: { tutorId: id },
        orderBy: { scheduledDate: 'desc' },
        include: { pet: true, service: true, professional: true },
      }),
      this.prisma.sale.findMany({
        where: { tutorId: id },
        orderBy: { createdAt: 'desc' },
        include: { items: true },
      }),
      this.prisma.boarding.findMany({
        where: { tutorId: id },
        orderBy: { checkInDate: 'desc' },
        include: { pet: true, room: true },
      }),
    ]);

    return {
      tutor,
      appointments,
      sales,
      boardings,
    };
  }
}
