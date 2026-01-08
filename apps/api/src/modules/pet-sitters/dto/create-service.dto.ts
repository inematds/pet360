import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsEnum,
  IsObject,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum PetSitterServiceType {
  WALK = 'WALK',
  DAYCARE = 'DAYCARE',
  BOARDING = 'BOARDING',
  VISIT = 'VISIT',
  GROOMING = 'GROOMING',
  TRAINING = 'TRAINING',
  VET_TRANSPORT = 'VET_TRANSPORT',
}

export enum PriceType {
  PER_VISIT = 'PER_VISIT',
  PER_HOUR = 'PER_HOUR',
  PER_DAY = 'PER_DAY',
  PER_NIGHT = 'PER_NIGHT',
  PER_WALK = 'PER_WALK',
}

export class CreateServiceDto {
  @ApiProperty({ enum: PetSitterServiceType, example: 'WALK' })
  @IsEnum(PetSitterServiceType)
  serviceType: PetSitterServiceType;

  @ApiProperty({ example: 'Passeio de 30 minutos' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Passeio com brincadeiras no parque' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: PriceType, example: 'PER_WALK' })
  @IsEnum(PriceType)
  priceType: PriceType;

  @ApiProperty({ example: 35.00 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ example: { SMALL: 25, MEDIUM: 35, LARGE: 45 } })
  @IsOptional()
  @IsObject()
  pricePerSize?: Record<string, number>;

  @ApiPropertyOptional({ example: 30 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  duration?: number;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  maxPets?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  includesFood?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  includesMeds?: boolean;

  @ApiPropertyOptional({ example: { monday: ['08:00-12:00', '14:00-18:00'] } })
  @IsOptional()
  @IsObject()
  availability?: Record<string, string[]>;
}
