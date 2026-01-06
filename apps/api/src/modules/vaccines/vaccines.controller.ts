import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { VaccinesService } from './vaccines.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('vaccines')
@Controller('vaccines')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class VaccinesController {
  constructor(private vaccinesService: VaccinesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar vacinas' })
  async findAll(@Request() req: any, @Query() query: any) {
    return this.vaccinesService.findAll(req.user.businessId, query);
  }

  @Get('pending')
  @ApiOperation({ summary: 'Vacinas vencendo' })
  async findPending(@Request() req: any, @Query('days') days?: number) {
    return this.vaccinesService.findPending(req.user.businessId, days);
  }

  @Get(':petId/card')
  @ApiOperation({ summary: 'Carteira de vacinacao' })
  async getVaccineCard(@Param('petId') petId: string, @Request() req: any) {
    return this.vaccinesService.getVaccineCard(petId, req.user.businessId);
  }

  @Post()
  @ApiOperation({ summary: 'Registrar vacina' })
  async create(@Body() data: any, @Request() req: any) {
    return this.vaccinesService.create(req.user.businessId, req.user.sub, data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar vacina' })
  async update(@Param('id') id: string, @Body() data: any, @Request() req: any) {
    return this.vaccinesService.update(id, req.user.businessId, data);
  }
}
