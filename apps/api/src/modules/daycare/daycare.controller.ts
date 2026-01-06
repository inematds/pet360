import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DaycareService } from './daycare.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('daycare')
@Controller('daycare')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DaycareController {
  constructor(private daycareService: DaycareService) {}

  @Get('packages')
  @ApiOperation({ summary: 'Listar pacotes' })
  async findAllPackages(@Request() req: any) {
    return this.daycareService.findAllPackages(req.user.businessId);
  }

  @Post('packages')
  @ApiOperation({ summary: 'Criar pacote' })
  async createPackage(@Body() data: any, @Request() req: any) {
    return this.daycareService.createPackage(req.user.businessId, data);
  }

  @Get('enrollments')
  @ApiOperation({ summary: 'Listar matriculas' })
  async findAllEnrollments(@Request() req: any, @Query() query: any) {
    return this.daycareService.findAllEnrollments(req.user.businessId, query);
  }

  @Post('enrollments')
  @ApiOperation({ summary: 'Criar matricula' })
  async createEnrollment(@Body() data: any) {
    return this.daycareService.createEnrollment(data);
  }

  @Get('attendance')
  @ApiOperation({ summary: 'Frequencia do dia' })
  async getTodayAttendance(@Request() req: any) {
    return this.daycareService.getTodayAttendance(req.user.businessId);
  }

  @Post('attendance/:enrollmentId/checkin')
  @ApiOperation({ summary: 'Check-in' })
  async checkIn(@Param('enrollmentId') enrollmentId: string) {
    return this.daycareService.checkIn(enrollmentId, new Date());
  }

  @Post('attendance/:enrollmentId/checkout')
  @ApiOperation({ summary: 'Check-out' })
  async checkOut(@Param('enrollmentId') enrollmentId: string) {
    return this.daycareService.checkOut(enrollmentId, new Date());
  }

  @Put('attendance/:id')
  @ApiOperation({ summary: 'Atualizar frequencia' })
  async updateAttendance(@Param('id') id: string, @Body() data: any) {
    return this.daycareService.updateAttendance(id, data);
  }
}
