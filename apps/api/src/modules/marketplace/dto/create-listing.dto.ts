import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsBoolean,
  IsEnum,
  IsDateString,
  Min,
  IsObject,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Species, PetSize } from '@prisma/client';

export enum ShippingType {
  CORREIOS = 'CORREIOS',
  TRANSPORTADORA = 'TRANSPORTADORA',
  RETIRADA = 'RETIRADA',
  DIGITAL = 'DIGITAL',
}

export class CreateListingDto {
  @ApiProperty({ example: 'category-uuid' })
  @IsString()
  categoryId: string;

  @ApiProperty({ example: 'Racao Premium para Caes Adultos 15kg' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Racao super premium...' })
  @IsString()
  description: string;

  @ApiPropertyOptional({ example: 'Racao premium de alta qualidade' })
  @IsOptional()
  @IsString()
  shortDescription?: string;

  @ApiPropertyOptional({ example: 'Royal Canin' })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiPropertyOptional({ example: 'RC-ADULT-15KG' })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiPropertyOptional({ example: '7891234567890' })
  @IsOptional()
  @IsString()
  barcode?: string;

  @ApiPropertyOptional({ example: ['DOG', 'CAT'] })
  @IsOptional()
  @IsArray()
  forSpecies?: Species[];

  @ApiPropertyOptional({ example: ['MEDIUM', 'LARGE'] })
  @IsOptional()
  @IsArray()
  forSizes?: PetSize[];

  @ApiProperty({ example: 199.90 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ example: 249.90 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  compareAtPrice?: number;

  @ApiPropertyOptional({ example: 150.00 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  costPrice?: number;

  @ApiProperty({ example: 50 })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  lowStockThreshold?: number;

  @ApiPropertyOptional({ example: 15.5 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  weight?: number;

  @ApiPropertyOptional({ example: { length: 50, width: 30, height: 20 } })
  @IsOptional()
  @IsObject()
  dimensions?: { length: number; width: number; height: number };

  @ApiPropertyOptional({ example: ['https://example.com/image1.jpg'] })
  @IsOptional()
  @IsArray()
  images?: string[];

  @ApiPropertyOptional({ example: 'https://youtube.com/video' })
  @IsOptional()
  @IsString()
  videoUrl?: string;

  @ApiPropertyOptional({ example: ['racao', 'premium', 'cachorro'] })
  @IsOptional()
  @IsArray()
  tags?: string[];

  @ApiPropertyOptional({ example: { sabor: 'Frango', peso: '15kg' } })
  @IsOptional()
  @IsObject()
  attributes?: Record<string, string>;

  @ApiPropertyOptional({ example: { proteina: '28%', gordura: '15%' } })
  @IsOptional()
  @IsObject()
  nutritionInfo?: Record<string, string>;

  @ApiPropertyOptional({ example: 'Frango, arroz, milho...' })
  @IsOptional()
  @IsString()
  ingredients?: string;

  @ApiPropertyOptional({ example: '2025-12-31' })
  @IsOptional()
  @IsDateString()
  expirationDate?: string;

  @ApiPropertyOptional({ enum: ShippingType, example: 'CORREIOS' })
  @IsOptional()
  @IsEnum(ShippingType)
  shippingType?: ShippingType;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  freeShipping?: boolean;

  @ApiPropertyOptional({ example: 15.00 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  shippingPrice?: number;
}
