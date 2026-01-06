import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BoardingService } from './boarding.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('boarding')
@Controller('boarding')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BoardingController {
  constructor(private boardingService: BoardingService) {}

  @Get('rooms')
  @ApiOperation({ summary: 'Listar quartos' })
  async findAllRooms(@Request() req: any) {
    return this.boardingService.findAllRooms(req.user.businessId);
  }

  @Post('rooms')
  @ApiOperation({ summary: 'Criar quarto' })
  async createRoom(@Body() data: any, @Request() req: any) {
    return this.boardingService.createRoom(req.user.businessId, data);
  }

  @Put('rooms/:id')
  @ApiOperation({ summary: 'Atualizar quarto' })
  async updateRoom(@Param('id') id: string, @Body() data: any, @Request() req: any) {
    return this.boardingService.updateRoom(id, req.user.businessId, data);
  }

  @Get('rooms/availability')
  @ApiOperation({ summary: 'Disponibilidade de quartos' })
  async getRoomAvailability(@Request() req: any, @Query('startDate') startDate: string, @Query('endDate') endDate: string) {
    return this.boardingService.getRoomAvailability(req.user.businessId, startDate, endDate);
  }

  @Get('reservations')
  @ApiOperation({ summary: 'Listar reservas' })
  async findAllBoardings(@Request() req: any, @Query() query: any) {
    return this.boardingService.findAllBoardings(req.user.businessId, query);
  }

  @Post('reservations')
  @ApiOperation({ summary: 'Criar reserva' })
  async createBoarding(@Body() data: any, @Request() req: any) {
    return this.boardingService.createBoarding(req.user.businessId, data);
  }

  @Post('reservations/:id/checkin')
  @ApiOperation({ summary: 'Check-in' })
  async checkIn(@Param('id') id: string, @Request() req: any) {
    return this.boardingService.checkIn(id, req.user.businessId);
  }

  @Post('reservations/:id/checkout')
  @ApiOperation({ summary: 'Check-out' })
  async checkOut(@Param('id') id: string, @Request() req: any) {
    return this.boardingService.checkOut(id, req.user.businessId);
  }

  @Post('reservations/:id/updates')
  @ApiOperation({ summary: 'Adicionar atualizacao' })
  async addUpdate(@Param('id') id: string, @Body() data: any, @Request() req: any) {
    return this.boardingService.addUpdate(id, req.user.sub, data);
  }

  @Get('reservations/:id/updates')
  @ApiOperation({ summary: 'Listar atualizacoes' })
  async getUpdates(@Param('id') id: string) {
    return this.boardingService.getUpdates(id);
  }
}
