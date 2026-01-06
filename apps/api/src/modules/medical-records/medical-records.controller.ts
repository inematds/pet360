import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MedicalRecordsService } from './medical-records.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('medical-records')
@Controller('medical-records')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MedicalRecordsController {
  constructor(private medicalRecordsService: MedicalRecordsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar prontuarios' })
  async findAll(@Request() req: any, @Query() query: any) {
    return this.medicalRecordsService.findAll(req.user.businessId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar prontuario por ID' })
  async findOne(@Param('id') id: string, @Request() req: any) {
    return this.medicalRecordsService.findOne(id, req.user.businessId);
  }

  @Post()
  @ApiOperation({ summary: 'Criar prontuario' })
  async create(@Body() data: any, @Request() req: any) {
    return this.medicalRecordsService.create(req.user.businessId, req.user.sub, data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar prontuario' })
  async update(@Param('id') id: string, @Body() data: any, @Request() req: any) {
    return this.medicalRecordsService.update(id, req.user.businessId, data);
  }
}
