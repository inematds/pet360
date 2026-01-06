import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('analytics')
@Controller('analytics')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'KPIs principais' })
  async getDashboard(@Request() req: any) {
    return this.analyticsService.getDashboard(req.user.businessId);
  }

  @Get('appointments')
  @ApiOperation({ summary: 'Metricas de agendamentos' })
  async getAppointmentsMetrics(@Request() req: any, @Query('startDate') startDate: string, @Query('endDate') endDate: string) {
    return this.analyticsService.getAppointmentsMetrics(req.user.businessId, startDate, endDate);
  }

  @Get('pets')
  @ApiOperation({ summary: 'Metricas de pets' })
  async getPetsMetrics(@Request() req: any) {
    return this.analyticsService.getPetsMetrics(req.user.businessId);
  }

  @Get('revenue')
  @ApiOperation({ summary: 'Receita mensal' })
  async getRevenueMetrics(@Request() req: any, @Query('year') year?: number) {
    return this.analyticsService.getRevenueMetrics(req.user.businessId, year || new Date().getFullYear());
  }

  @Get('services')
  @ApiOperation({ summary: 'Servicos mais vendidos' })
  async getTopServices(@Request() req: any, @Query('limit') limit?: number) {
    return this.analyticsService.getTopServices(req.user.businessId, limit);
  }

  @Get('products')
  @ApiOperation({ summary: 'Produtos mais vendidos' })
  async getTopProducts(@Request() req: any, @Query('limit') limit?: number) {
    return this.analyticsService.getTopProducts(req.user.businessId, limit);
  }
}
