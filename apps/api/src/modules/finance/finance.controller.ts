import { Controller, Get, Post, Body, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FinanceService } from './finance.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('finance')
@Controller('finance')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FinanceController {
  constructor(private financeService: FinanceService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Dashboard financeiro' })
  async getDashboard(@Request() req: any) {
    return this.financeService.getDashboard(req.user.businessId);
  }

  @Get('cash-register')
  @ApiOperation({ summary: 'Caixa do dia' })
  async getCashRegister(@Request() req: any, @Query('date') date?: string) {
    return this.financeService.getCashRegister(req.user.businessId, date ? new Date(date) : new Date());
  }

  @Post('cash-register/close')
  @ApiOperation({ summary: 'Fechar caixa' })
  async closeCashRegister(@Request() req: any, @Body() data: { date: string; notes?: string }) {
    return this.financeService.closeCashRegister(req.user.businessId, new Date(data.date), req.user.sub, data.notes);
  }

  @Get('reports/daily')
  @ApiOperation({ summary: 'Relatorio diario' })
  async getReportDaily(@Request() req: any, @Query('startDate') startDate: string, @Query('endDate') endDate: string) {
    return this.financeService.getReportDaily(req.user.businessId, startDate, endDate);
  }

  @Get('reports/monthly')
  @ApiOperation({ summary: 'Relatorio mensal' })
  async getReportMonthly(@Request() req: any, @Query('year') year: number) {
    return this.financeService.getReportMonthly(req.user.businessId, year || new Date().getFullYear());
  }
}
