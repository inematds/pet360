import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('products')
@Controller('products')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar produtos' })
  async findAll(@Request() req: any, @Query() query: any) {
    return this.productsService.findAll(req.user.businessId, query);
  }

  @Get('low-stock')
  @ApiOperation({ summary: 'Produtos com estoque baixo' })
  async getLowStock(@Request() req: any) {
    return this.productsService.getLowStock(req.user.businessId);
  }

  @Get('expiring')
  @ApiOperation({ summary: 'Produtos vencendo' })
  async getExpiring(@Request() req: any, @Query('days') days?: number) {
    return this.productsService.getExpiring(req.user.businessId, days);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar produto por ID' })
  async findOne(@Param('id') id: string, @Request() req: any) {
    return this.productsService.findOne(id, req.user.businessId);
  }

  @Post()
  @ApiOperation({ summary: 'Criar produto' })
  async create(@Body() data: any, @Request() req: any) {
    return this.productsService.create(req.user.businessId, data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar produto' })
  async update(@Param('id') id: string, @Body() data: any, @Request() req: any) {
    return this.productsService.update(id, req.user.businessId, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover produto' })
  async delete(@Param('id') id: string, @Request() req: any) {
    return this.productsService.delete(id, req.user.businessId);
  }

  @Post('stock/movements')
  @ApiOperation({ summary: 'Registrar movimento de estoque' })
  async addStockMovement(@Body() data: any) {
    return this.productsService.addStockMovement(data.productId, data);
  }
}
