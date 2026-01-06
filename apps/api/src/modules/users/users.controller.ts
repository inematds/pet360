import { Controller, Get, Put, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Listar usuarios do negocio' })
  async findAll(@Request() req: any) {
    return this.usersService.findByBusinessId(req.user.businessId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar usuario por ID' })
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar usuario' })
  async update(@Param('id') id: string, @Body() data: any) {
    return this.usersService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover usuario' })
  async delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
