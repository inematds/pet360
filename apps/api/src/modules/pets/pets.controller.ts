import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PetsService } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('pets')
@Controller('pets')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PetsController {
  constructor(private petsService: PetsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar pets' })
  async findAll(@Request() req: any, @Query() query: any) {
    return this.petsService.findAll(req.user.businessId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar pet por ID' })
  async findOne(@Param('id') id: string, @Request() req: any) {
    return this.petsService.findOne(id, req.user.businessId);
  }

  @Get(':id/vaccines')
  @ApiOperation({ summary: 'Carteira de vacinacao do pet' })
  async getVaccineCard(@Param('id') id: string, @Request() req: any) {
    return this.petsService.getVaccineCard(id, req.user.businessId);
  }

  @Get(':id/medical')
  @ApiOperation({ summary: 'Historico medico do pet' })
  async getMedicalHistory(@Param('id') id: string, @Request() req: any) {
    return this.petsService.getMedicalHistory(id, req.user.businessId);
  }

  @Post()
  @ApiOperation({ summary: 'Cadastrar pet' })
  async create(@Body() dto: CreatePetDto, @Request() req: any) {
    return this.petsService.create(req.user.businessId, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar pet' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePetDto,
    @Request() req: any,
  ) {
    return this.petsService.update(id, req.user.businessId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover pet' })
  async delete(@Param('id') id: string, @Request() req: any) {
    return this.petsService.delete(id, req.user.businessId);
  }
}
