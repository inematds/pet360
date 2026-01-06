import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('appointments')
@Controller('appointments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AppointmentsController {
  constructor(private appointmentsService: AppointmentsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar agendamentos' })
  async findAll(@Request() req: any, @Query() query: any) {
    return this.appointmentsService.findAll(req.user.businessId, query);
  }

  @Get('calendar')
  @ApiOperation({ summary: 'Calendario de agendamentos' })
  async getCalendar(@Request() req: any, @Query('startDate') startDate: string, @Query('endDate') endDate: string) {
    return this.appointmentsService.getCalendar(req.user.businessId, startDate, endDate);
  }

  @Get('available-slots')
  @ApiOperation({ summary: 'Horarios disponiveis' })
  async getAvailableSlots(
    @Request() req: any,
    @Query('date') date: string,
    @Query('serviceId') serviceId: string,
    @Query('professionalId') professionalId?: string,
  ) {
    return this.appointmentsService.getAvailableSlots(req.user.businessId, date, serviceId, professionalId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar agendamento por ID' })
  async findOne(@Param('id') id: string, @Request() req: any) {
    return this.appointmentsService.findOne(id, req.user.businessId);
  }

  @Post()
  @ApiOperation({ summary: 'Criar agendamento' })
  async create(@Body() data: any, @Request() req: any) {
    return this.appointmentsService.create(req.user.businessId, data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar agendamento' })
  async update(@Param('id') id: string, @Body() data: any, @Request() req: any) {
    return this.appointmentsService.update(id, req.user.businessId, data);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Atualizar status do agendamento' })
  async updateStatus(
    @Param('id') id: string,
    @Body() data: { status: string },
    @Request() req: any,
  ) {
    return this.appointmentsService.updateStatus(id, req.user.businessId, data.status);
  }

  @Post(':id/confirm')
  @ApiOperation({ summary: 'Confirmar agendamento' })
  async confirm(@Param('id') id: string, @Request() req: any) {
    return this.appointmentsService.updateStatus(id, req.user.businessId, 'CONFIRMED');
  }

  @Post(':id/start')
  @ApiOperation({ summary: 'Iniciar atendimento' })
  async start(@Param('id') id: string, @Request() req: any) {
    return this.appointmentsService.updateStatus(id, req.user.businessId, 'IN_PROGRESS');
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Finalizar atendimento' })
  async complete(@Param('id') id: string, @Request() req: any) {
    return this.appointmentsService.updateStatus(id, req.user.businessId, 'COMPLETED');
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancelar agendamento' })
  async cancel(@Param('id') id: string, @Request() req: any) {
    return this.appointmentsService.updateStatus(id, req.user.businessId, 'CANCELLED');
  }
}
