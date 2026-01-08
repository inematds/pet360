import {
  IsString,
  IsEmail,
  IsOptional,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Species, PetSize } from '@prisma/client';

export class CreateBookingDto {
  @ApiProperty({ example: 'service-uuid' })
  @IsString()
  serviceId: string;

  @ApiProperty({ example: 'Joao Silva' })
  @IsString()
  tutorName: string;

  @ApiProperty({ example: 'joao@email.com' })
  @IsEmail()
  tutorEmail: string;

  @ApiProperty({ example: '(11) 99999-9999' })
  @IsString()
  tutorPhone: string;

  @ApiProperty({ example: 'Thor' })
  @IsString()
  petName: string;

  @ApiProperty({ enum: ['DOG', 'CAT', 'BIRD', 'RODENT', 'REPTILE', 'OTHER'], example: 'DOG' })
  @IsEnum(Species)
  petSpecies: Species;

  @ApiPropertyOptional({ enum: ['MINI', 'SMALL', 'MEDIUM', 'LARGE', 'GIANT'], example: 'MEDIUM' })
  @IsOptional()
  @IsEnum(PetSize)
  petSize?: PetSize;

  @ApiPropertyOptional({ example: '3 anos' })
  @IsOptional()
  @IsString()
  petAge?: string;

  @ApiPropertyOptional({ example: 'Alergico a frango' })
  @IsOptional()
  @IsString()
  petNotes?: string;

  @ApiProperty({ example: '2025-01-15' })
  @IsDateString()
  startDate: string;

  @ApiPropertyOptional({ example: '2025-01-17' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ example: '08:00' })
  @IsOptional()
  @IsString()
  startTime?: string;

  @ApiPropertyOptional({ example: '18:00' })
  @IsOptional()
  @IsString()
  endTime?: string;

  @ApiPropertyOptional({ example: 'Pet precisa de medicacao as 12h' })
  @IsOptional()
  @IsString()
  specialRequests?: string;

  @ApiPropertyOptional({ example: 'Maria - esposa' })
  @IsOptional()
  @IsString()
  emergencyContact?: string;

  @ApiPropertyOptional({ example: '(11) 88888-8888' })
  @IsOptional()
  @IsString()
  emergencyPhone?: string;

  @ApiPropertyOptional({ example: 'Dr. Pet' })
  @IsOptional()
  @IsString()
  vetName?: string;

  @ApiPropertyOptional({ example: '(11) 3333-3333' })
  @IsOptional()
  @IsString()
  vetPhone?: string;

  @ApiPropertyOptional({ example: 'Racao Golden 2x ao dia' })
  @IsOptional()
  @IsString()
  feedingInstructions?: string;

  @ApiPropertyOptional({ example: 'Vermifugo 1x por semana' })
  @IsOptional()
  @IsString()
  medicationInstructions?: string;
}
