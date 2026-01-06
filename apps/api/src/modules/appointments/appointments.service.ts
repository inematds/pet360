import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(businessId: string, query?: any) {
    const { date, status, professionalId, petId, page = 1, limit = 50 } = query || {};
    const where: any = { businessId };

    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      where.scheduledDate = { gte: startDate, lte: endDate };
    }
    if (status) where.status = status;
    if (professionalId) where.professionalId = professionalId;
    if (petId) where.petId = petId;

    const [appointments, total] = await Promise.all([
      this.prisma.appointment.findMany({
        where,
        include: {
          tutor: { select: { id: true, name: true, phone: true } },
          pet: { select: { id: true, name: true, species: true, breed: true, photoUrl: true } },
          service: true,
          professional: { select: { id: true, name: true, color: true } },
        },
        orderBy: [{ scheduledDate: 'asc' }, { scheduledTime: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.appointment.count({ where }),
    ]);

    return { data: appointments, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string, businessId: string) {
    const appointment = await this.prisma.appointment.findFirst({
      where: { id, businessId },
      include: {
        tutor: true,
        pet: true,
        service: true,
        professional: true,
        medicalRecords: true,
        vaccineRecords: true,
      },
    });
    if (!appointment) throw new NotFoundException('Agendamento nao encontrado');
    return appointment;
  }

  async create(businessId: string, data: any) {
    const service = await this.prisma.service.findFirst({
      where: { id: data.serviceId, businessId },
    });
    if (!service) throw new BadRequestException('Servico nao encontrado');

    return this.prisma.appointment.create({
      data: {
        ...data,
        businessId,
        duration: service.duration,
        price: data.price || service.price,
        finalPrice: data.finalPrice || data.price || service.price,
      },
      include: { tutor: true, pet: true, service: true, professional: true },
    });
  }

  async update(id: string, businessId: string, data: any) {
    await this.findOne(id, businessId);
    return this.prisma.appointment.update({
      where: { id },
      data,
      include: { tutor: true, pet: true, service: true, professional: true },
    });
  }

  async updateStatus(id: string, businessId: string, status: string) {
    const appointment = await this.findOne(id, businessId);
    const updateData: any = { status };

    switch (status) {
      case 'CONFIRMED':
        updateData.confirmedAt = new Date();
        break;
      case 'IN_PROGRESS':
        updateData.startedAt = new Date();
        break;
      case 'COMPLETED':
        updateData.completedAt = new Date();
        break;
      case 'CANCELLED':
        updateData.cancelledAt = new Date();
        break;
    }

    return this.prisma.appointment.update({
      where: { id },
      data: updateData,
    });
  }

  async getCalendar(businessId: string, startDate: string, endDate: string) {
    return this.prisma.appointment.findMany({
      where: {
        businessId,
        scheduledDate: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      include: {
        pet: { select: { id: true, name: true, species: true } },
        service: { select: { id: true, name: true, category: true } },
        professional: { select: { id: true, name: true, color: true } },
      },
      orderBy: [{ scheduledDate: 'asc' }, { scheduledTime: 'asc' }],
    });
  }

  async getAvailableSlots(businessId: string, date: string, serviceId: string, professionalId?: string) {
    const service = await this.prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) throw new BadRequestException('Servico nao encontrado');

    const targetDate = new Date(date);
    const appointments = await this.prisma.appointment.findMany({
      where: {
        businessId,
        scheduledDate: targetDate,
        status: { notIn: ['CANCELLED', 'NO_SHOW'] },
        ...(professionalId && { professionalId }),
      },
    });

    const slots: string[] = [];
    const startHour = 8;
    const endHour = 18;
    const interval = 30;

    for (let hour = startHour; hour < endHour; hour++) {
      for (let min = 0; min < 60; min += interval) {
        const time = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
        const isOccupied = appointments.some((apt) => apt.scheduledTime === time);
        if (!isOccupied) slots.push(time);
      }
    }

    return slots;
  }
}
