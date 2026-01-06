import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PetSittersService } from './pet-sitters.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('pet-sitters')
@Controller('pet-sitters')
export class PetSittersController {
  constructor(private petSittersService: PetSittersService) {}

  @Post('register')
  @ApiOperation({ summary: 'Cadastrar como cuidador de pets' })
  async register(@Body() data: any) {
    return this.petSittersService.register(data);
  }

  @Get()
  @ApiOperation({ summary: 'Listar cuidadores disponiveis' })
  async findAll(
    @Query('city') city?: string,
    @Query('state') state?: string,
    @Query('species') species?: string,
    @Query('size') size?: string,
    @Query('serviceType') serviceType?: string,
    @Query('minRating') minRating?: number,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.petSittersService.findAll({ city, state, species, size, serviceType, minRating, page, limit });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhes do cuidador' })
  async findOne(@Param('id') id: string) {
    return this.petSittersService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar perfil do cuidador' })
  async update(@Param('id') id: string, @Body() data: any) {
    return this.petSittersService.update(id, data);
  }

  // Services
  @Post(':id/services')
  @ApiOperation({ summary: 'Adicionar servico' })
  async addService(@Param('id') id: string, @Body() data: any) {
    return this.petSittersService.addService(id, data);
  }

  @Put('services/:serviceId')
  @ApiOperation({ summary: 'Atualizar servico' })
  async updateService(@Param('serviceId') serviceId: string, @Body() data: any) {
    return this.petSittersService.updateService(serviceId, data);
  }

  @Delete('services/:serviceId')
  @ApiOperation({ summary: 'Remover servico' })
  async deleteService(@Param('serviceId') serviceId: string) {
    return this.petSittersService.deleteService(serviceId);
  }

  // Bookings
  @Post('bookings')
  @ApiOperation({ summary: 'Criar reserva com cuidador' })
  async createBooking(@Body() data: any) {
    return this.petSittersService.createBooking(data);
  }

  @Get(':id/bookings')
  @ApiOperation({ summary: 'Listar reservas do cuidador' })
  async getBookings(@Param('id') id: string, @Query('status') status?: string) {
    return this.petSittersService.getBookings(id, status);
  }

  @Put('bookings/:bookingId/status')
  @ApiOperation({ summary: 'Atualizar status da reserva' })
  async updateBookingStatus(
    @Param('bookingId') bookingId: string,
    @Body() data: { status: string; reason?: string },
  ) {
    return this.petSittersService.updateBookingStatus(bookingId, data.status, data.reason);
  }

  // Reviews
  @Post('bookings/:bookingId/review')
  @ApiOperation({ summary: 'Avaliar cuidador' })
  async createReview(@Param('bookingId') bookingId: string, @Body() data: any) {
    return this.petSittersService.createReview(bookingId, data);
  }

  // Admin endpoints
  @Get('admin/pending')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar cuidadores pendentes de aprovacao' })
  async getPendingApprovals() {
    return this.petSittersService.getPendingApprovals();
  }

  @Put('admin/:id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Aprovar/Rejeitar cuidador' })
  async updateStatus(@Param('id') id: string, @Body() data: { status: string; reason?: string }) {
    return this.petSittersService.updateStatus(id, data.status, data.reason);
  }
}
