import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ServicesService } from './services.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('services')
@Controller('services')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ServicesController {
  constructor(private servicesService: ServicesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar servicos' })
  async findAll(@Request() req: any, @Query() query: any) {
    return this.servicesService.findAll(req.user.businessId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar servico por ID' })
  async findOne(@Param('id') id: string, @Request() req: any) {
    return this.servicesService.findOne(id, req.user.businessId);
  }

  @Post()
  @ApiOperation({ summary: 'Criar servico' })
  async create(@Body() data: any, @Request() req: any) {
    return this.servicesService.create(req.user.businessId, data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar servico' })
  async update(@Param('id') id: string, @Body() data: any, @Request() req: any) {
    return this.servicesService.update(id, req.user.businessId, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover servico' })
  async delete(@Param('id') id: string, @Request() req: any) {
    return this.servicesService.delete(id, req.user.businessId);
  }
}
