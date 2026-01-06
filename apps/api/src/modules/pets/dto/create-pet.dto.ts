import {
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsArray,
  IsNumber,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Species, PetSize, PetGender } from '@prisma/client';

export class CreatePetDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tutorId?: string;

  @ApiProperty({ example: 'Thor' })
  @IsString()
  name: string;

  @ApiProperty({ enum: Species, example: 'DOG' })
  @IsEnum(Species)
  species: Species;

  @ApiPropertyOptional({ example: 'Golden Retriever' })
  @IsOptional()
  @IsString()
  breed?: string;

  @ApiPropertyOptional({ enum: PetSize, example: 'LARGE' })
  @IsOptional()
  @IsEnum(PetSize)
  size?: PetSize;

  @ApiPropertyOptional({ enum: PetGender, example: 'MALE' })
  @IsOptional()
  @IsEnum(PetGender)
  gender?: PetGender;

  @ApiPropertyOptional({ example: 'Dourado' })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiPropertyOptional({ example: '2020-05-15' })
  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @ApiPropertyOptional({ example: '4 anos' })
  @IsOptional()
  @IsString()
  estimatedAge?: string;

  @ApiPropertyOptional({ example: 32.5 })
  @IsOptional()
  @IsNumber()
  weight?: number;

  @ApiPropertyOptional({ example: '981020000123456' })
  @IsOptional()
  @IsString()
  microchipNumber?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isNeutered?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  photoUrl?: string;

  @ApiPropertyOptional({ example: ['Alergia a frango'] })
  @IsOptional()
  @IsArray()
  allergies?: string[];

  @ApiPropertyOptional({ example: ['Displasia coxofemoral'] })
  @IsOptional()
  @IsArray()
  chronicConditions?: string[];

  @ApiPropertyOptional({ example: 'Nao pode comer ossos' })
  @IsOptional()
  @IsString()
  dietaryRestrictions?: string;

  @ApiPropertyOptional({ example: 'Muito docil com criancas' })
  @IsOptional()
  @IsString()
  observations?: string;

  @ApiPropertyOptional({ example: 'FRIENDLY' })
  @IsOptional()
  @IsString()
  temperament?: string;
}
