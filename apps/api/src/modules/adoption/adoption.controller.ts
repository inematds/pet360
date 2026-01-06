import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdoptionService } from './adoption.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('adoption')
@Controller('adoption')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AdoptionController {
  constructor(private adoptionService: AdoptionService) {}

  @Get('animals')
  @ApiOperation({ summary: 'Listar animais para adocao' })
  async findAllAnimals(@Request() req: any, @Query() query: any) {
    return this.adoptionService.findAllAnimals(req.user.businessId, query);
  }

  @Get('animals/:id')
  @ApiOperation({ summary: 'Detalhes do animal' })
  async findOneAnimal(@Param('id') id: string, @Request() req: any) {
    return this.adoptionService.findOneAnimal(id, req.user.businessId);
  }

  @Post('animals')
  @ApiOperation({ summary: 'Cadastrar animal para adocao' })
  async createAnimal(@Body() data: any, @Request() req: any) {
    return this.adoptionService.createAnimal(req.user.businessId, data);
  }

  @Put('animals/:id')
  @ApiOperation({ summary: 'Atualizar animal' })
  async updateAnimal(@Param('id') id: string, @Body() data: any, @Request() req: any) {
    return this.adoptionService.updateAnimal(id, req.user.businessId, data);
  }

  @Post('inquiries')
  @ApiOperation({ summary: 'Manifestar interesse' })
  async createInquiry(@Body() data: any) {
    return this.adoptionService.createInquiry(data.adoptionAnimalId, data);
  }

  @Post('processes')
  @ApiOperation({ summary: 'Iniciar processo de adocao' })
  async createAdoption(@Body() data: any, @Request() req: any) {
    return this.adoptionService.createAdoption(req.user.businessId, data);
  }

  @Put('processes/:id')
  @ApiOperation({ summary: 'Atualizar processo' })
  async updateAdoption(@Param('id') id: string, @Body() data: any) {
    return this.adoptionService.updateAdoption(id, data);
  }

  @Post('processes/:id/complete')
  @ApiOperation({ summary: 'Finalizar adocao' })
  async completeAdoption(@Param('id') id: string, @Body('tutorId') tutorId: string) {
    return this.adoptionService.completeAdoption(id, tutorId);
  }
}
