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
import { TutorsService } from './tutors.service';
import { CreateTutorDto } from './dto/create-tutor.dto';
import { UpdateTutorDto } from './dto/update-tutor.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('tutors')
@Controller('tutors')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TutorsController {
  constructor(private tutorsService: TutorsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar tutores' })
  async findAll(@Request() req: any, @Query() query: any) {
    return this.tutorsService.findAll(req.user.businessId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar tutor por ID' })
  async findOne(@Param('id') id: string, @Request() req: any) {
    return this.tutorsService.findOne(id, req.user.businessId);
  }

  @Get(':id/history')
  @ApiOperation({ summary: 'Historico completo do tutor' })
  async getHistory(@Param('id') id: string, @Request() req: any) {
    return this.tutorsService.getHistory(id, req.user.businessId);
  }

  @Post()
  @ApiOperation({ summary: 'Criar tutor' })
  async create(@Body() dto: CreateTutorDto, @Request() req: any) {
    return this.tutorsService.create(req.user.businessId, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar tutor' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTutorDto,
    @Request() req: any,
  ) {
    return this.tutorsService.update(id, req.user.businessId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover tutor' })
  async delete(@Param('id') id: string, @Request() req: any) {
    return this.tutorsService.delete(id, req.user.businessId);
  }
}
