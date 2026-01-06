import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SalesService } from './sales.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('sales')
@Controller('sales')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SalesController {
  constructor(private salesService: SalesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar vendas' })
  async findAll(@Request() req: any, @Query() query: any) {
    return this.salesService.findAll(req.user.businessId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar venda por ID' })
  async findOne(@Param('id') id: string, @Request() req: any) {
    return this.salesService.findOne(id, req.user.businessId);
  }

  @Post()
  @ApiOperation({ summary: 'Criar venda' })
  async create(@Body() data: any, @Request() req: any) {
    return this.salesService.create(req.user.businessId, req.user.sub, data);
  }
}
