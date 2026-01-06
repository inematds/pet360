import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BoardingService {
  constructor(private prisma: PrismaService) {}

  async findAllRooms(businessId: string) {
    return this.prisma.boardingRoom.findMany({
      where: { businessId, isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async createRoom(businessId: string, data: any) {
    return this.prisma.boardingRoom.create({ data: { ...data, businessId } });
  }

  async updateRoom(id: string, businessId: string, data: any) {
    const room = await this.prisma.boardingRoom.findFirst({ where: { id, businessId } });
    if (!room) throw new NotFoundException('Quarto nao encontrado');
    return this.prisma.boardingRoom.update({ where: { id }, data });
  }

  async getRoomAvailability(businessId: string, startDate: string, endDate: string) {
    const rooms = await this.prisma.boardingRoom.findMany({
      where: { businessId, isActive: true },
      include: {
        boardings: {
          where: {
            OR: [
              { checkInDate: { lte: new Date(endDate) }, checkOutDate: { gte: new Date(startDate) } },
            ],
            status: { in: ['RESERVED', 'CHECKED_IN'] },
          },
        },
      },
    });
    return rooms.map((room) => ({
      ...room,
      isAvailable: room.boardings.length === 0,
    }));
  }

  async findAllBoardings(businessId: string, query?: any) {
    const { status, roomId, page = 1, limit = 20 } = query || {};
    const where: any = { businessId };
    if (status) where.status = status;
    if (roomId) where.roomId = roomId;

    const [boardings, total] = await Promise.all([
      this.prisma.boarding.findMany({
        where,
        include: { pet: true, tutor: true, room: true },
        orderBy: { checkInDate: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.boarding.count({ where }),
    ]);
    return { data: boardings, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async createBoarding(businessId: string, data: any) {
    const room = await this.prisma.boardingRoom.findFirst({ where: { id: data.roomId, businessId } });
    if (!room) throw new BadRequestException('Quarto nao encontrado');

    const checkIn = new Date(data.checkInDate);
    const checkOut = new Date(data.checkOutDate);
    const totalDays = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    const subtotal = Number(room.dailyRate) * totalDays;

    return this.prisma.boarding.create({
      data: {
        ...data,
        businessId,
        dailyRate: room.dailyRate,
        totalDays,
        subtotal,
        totalAmount: subtotal - (data.discount || 0) + (data.extraServices || 0),
      },
      include: { pet: true, tutor: true, room: true },
    });
  }

  async checkIn(id: string, businessId: string) {
    const boarding = await this.prisma.boarding.findFirst({ where: { id, businessId } });
    if (!boarding) throw new NotFoundException('Reserva nao encontrada');
    return this.prisma.boarding.update({
      where: { id },
      data: { status: 'CHECKED_IN', actualCheckIn: new Date() },
    });
  }

  async checkOut(id: string, businessId: string) {
    const boarding = await this.prisma.boarding.findFirst({ where: { id, businessId } });
    if (!boarding) throw new NotFoundException('Reserva nao encontrada');
    return this.prisma.boarding.update({
      where: { id },
      data: { status: 'CHECKED_OUT', actualCheckOut: new Date() },
    });
  }

  async addUpdate(boardingId: string, userId: string, data: any) {
    return this.prisma.boardingUpdate.create({
      data: { ...data, boardingId, userId },
    });
  }

  async getUpdates(boardingId: string) {
    return this.prisma.boardingUpdate.findMany({
      where: { boardingId },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}
