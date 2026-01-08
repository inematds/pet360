import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PetSittersService {
  constructor(private prisma: PrismaService) {}

  // Pet Sitter Registration
  async register(data: any) {
    const existing = await this.prisma.petSitter.findUnique({ where: { email: data.email } });
    if (existing) throw new BadRequestException('Email ja cadastrado');

    return this.prisma.petSitter.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        cpf: data.cpf,
        bio: data.bio,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        latitude: data.latitude,
        longitude: data.longitude,
        serviceRadius: data.serviceRadius,
        acceptedSpecies: data.acceptedSpecies,
        acceptedSizes: data.acceptedSizes,
        experience: data.experience,
        hasOwnTransport: data.hasOwnTransport,
        hasYard: data.hasYard,
        hasOtherPets: data.hasOtherPets,
        otherPetsDetails: data.otherPetsDetails,
      },
    });
  }

  // List Pet Sitters with filters
  async findAll(query: {
    city?: string;
    state?: string;
    species?: string;
    size?: string;
    serviceType?: string;
    minRating?: number;
    page?: number;
    limit?: number;
  }) {
    const { city, state, species, size, serviceType, minRating } = query;
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;

    const where: Prisma.PetSitterWhereInput = {
      status: 'APPROVED',
      isActive: true,
    };

    if (city) where.city = { contains: city, mode: 'insensitive' };
    if (state) where.state = state;
    if (species) where.acceptedSpecies = { has: species as any };
    if (size) where.acceptedSizes = { has: size as any };
    if (minRating) where.averageRating = { gte: minRating };

    if (serviceType) {
      where.services = { some: { serviceType, isActive: true } };
    }

    const [petSitters, total] = await Promise.all([
      this.prisma.petSitter.findMany({
        where,
        include: {
          services: { where: { isActive: true } },
          _count: { select: { reviews: true, bookings: true } },
        },
        orderBy: [{ isFeatured: 'desc' }, { averageRating: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.petSitter.count({ where }),
    ]);

    return { petSitters, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  // Get Pet Sitter profile
  async findOne(id: string) {
    const petSitter = await this.prisma.petSitter.findUnique({
      where: { id },
      include: {
        services: { where: { isActive: true } },
        reviews: {
          where: { isPublished: true },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!petSitter) throw new NotFoundException('Cuidador nao encontrado');
    return petSitter;
  }

  // Update Pet Sitter profile
  async update(id: string, data: any) {
    return this.prisma.petSitter.update({ where: { id }, data });
  }

  // Add service to Pet Sitter
  async addService(petSitterId: string, data: any) {
    return this.prisma.petSitterService.create({
      data: {
        petSitterId,
        serviceType: data.serviceType,
        name: data.name,
        description: data.description,
        priceType: data.priceType,
        price: data.price,
        pricePerSize: data.pricePerSize,
        duration: data.duration,
        maxPets: data.maxPets,
        includesFood: data.includesFood,
        includesMeds: data.includesMeds,
        availability: data.availability,
      },
    });
  }

  // Update service
  async updateService(serviceId: string, data: any) {
    return this.prisma.petSitterService.update({ where: { id: serviceId }, data });
  }

  // Delete service
  async deleteService(serviceId: string) {
    return this.prisma.petSitterService.delete({ where: { id: serviceId } });
  }

  // Create booking
  async createBooking(data: any) {
    const service = await this.prisma.petSitterService.findUnique({
      where: { id: data.serviceId },
      include: { petSitter: true },
    });

    if (!service) throw new NotFoundException('Servico nao encontrado');
    if (service.petSitter.status !== 'APPROVED') {
      throw new BadRequestException('Cuidador nao disponivel');
    }

    const totalDays = data.endDate
      ? Math.ceil((new Date(data.endDate).getTime() - new Date(data.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1
      : 1;

    const subtotal = Number(service.price) * totalDays;
    const serviceFee = subtotal * 0.1; // 10% platform fee
    const totalAmount = subtotal + serviceFee;
    const sitterPayout = subtotal * 0.9; // 90% for sitter

    return this.prisma.petSitterBooking.create({
      data: {
        petSitterId: service.petSitterId,
        serviceId: data.serviceId,
        tutorName: data.tutorName,
        tutorEmail: data.tutorEmail,
        tutorPhone: data.tutorPhone,
        petName: data.petName,
        petSpecies: data.petSpecies,
        petSize: data.petSize,
        petAge: data.petAge,
        petNotes: data.petNotes,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        startTime: data.startTime,
        endTime: data.endTime,
        totalDays,
        pricePerUnit: service.price,
        subtotal,
        serviceFee,
        totalAmount,
        sitterPayout,
        specialRequests: data.specialRequests,
        emergencyContact: data.emergencyContact,
        emergencyPhone: data.emergencyPhone,
        vetName: data.vetName,
        vetPhone: data.vetPhone,
        feedingInstructions: data.feedingInstructions,
        medicationInstructions: data.medicationInstructions,
      },
      include: { petSitter: true, service: true },
    });
  }

  // Get bookings for pet sitter
  async getBookings(petSitterId: string, status?: string) {
    const where: Prisma.PetSitterBookingWhereInput = { petSitterId };
    if (status) where.status = status as any;

    return this.prisma.petSitterBooking.findMany({
      where,
      include: { service: true },
      orderBy: { startDate: 'desc' },
    });
  }

  // Update booking status
  async updateBookingStatus(bookingId: string, status: string, reason?: string) {
    const data: any = { status };

    if (status === 'CONFIRMED') data.confirmedAt = new Date();
    if (status === 'CANCELLED') {
      data.cancelledAt = new Date();
      data.cancellationReason = reason;
    }
    if (status === 'COMPLETED') data.completedAt = new Date();

    const booking = await this.prisma.petSitterBooking.update({
      where: { id: bookingId },
      data,
      include: { petSitter: true },
    });

    // Update pet sitter stats
    if (status === 'COMPLETED') {
      await this.prisma.petSitter.update({
        where: { id: booking.petSitterId },
        data: { totalBookings: { increment: 1 } },
      });
    }

    return booking;
  }

  // Create review
  async createReview(bookingId: string, data: any) {
    const booking = await this.prisma.petSitterBooking.findUnique({ where: { id: bookingId } });
    if (!booking) throw new NotFoundException('Reserva nao encontrada');
    if (booking.status !== 'COMPLETED') throw new BadRequestException('Reserva nao finalizada');

    const review = await this.prisma.petSitterReview.create({
      data: {
        bookingId,
        petSitterId: booking.petSitterId,
        rating: data.rating,
        title: data.title,
        comment: data.comment,
        photos: data.photos,
      },
    });

    // Update pet sitter rating
    const stats = await this.prisma.petSitterReview.aggregate({
      where: { petSitterId: booking.petSitterId, isPublished: true },
      _avg: { rating: true },
      _count: true,
    });

    await this.prisma.petSitter.update({
      where: { id: booking.petSitterId },
      data: {
        averageRating: stats._avg.rating || 0,
        totalReviews: stats._count,
      },
    });

    return review;
  }

  // Admin: Approve/Reject pet sitter
  async updateStatus(id: string, status: string, reason?: string) {
    const data: any = { status };
    if (status === 'APPROVED') data.approvedAt = new Date();
    if (status === 'REJECTED') data.rejectionReason = reason;

    return this.prisma.petSitter.update({ where: { id }, data });
  }

  // Get pending approvals
  async getPendingApprovals() {
    return this.prisma.petSitter.findMany({
      where: { status: 'PENDING_APPROVAL' },
      orderBy: { createdAt: 'asc' },
    });
  }
}
