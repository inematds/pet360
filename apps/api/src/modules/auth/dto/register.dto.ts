import { IsEmail, IsString, MinLength, IsOptional, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  // Business data
  @ApiProperty({ example: 'Pet Shop Feliz' })
  @IsString()
  businessName: string;

  @ApiPropertyOptional({ example: '12.345.678/0001-90' })
  @IsOptional()
  @IsString()
  cnpj?: string;

  @ApiProperty({ example: '(11) 99999-9999' })
  @IsString()
  businessPhone: string;

  @ApiPropertyOptional({ example: 'contato@petshopfeliz.com' })
  @IsOptional()
  @IsEmail()
  businessEmail?: string;

  @ApiProperty({
    example: ['PET_SHOP', 'VET_CLINIC', 'GROOMING'],
    description: 'Tipos de negocio: PET_SHOP, VET_CLINIC, HOTEL, DAYCARE, ADOPTION_CENTER, GROOMING'
  })
  @IsArray()
  businessTypes: string[];

  // User data
  @ApiProperty({ example: 'Joao Silva' })
  @IsString()
  userName: string;

  @ApiProperty({ example: 'joao@petshopfeliz.com' })
  @IsEmail()
  userEmail: string;

  @ApiProperty({ example: '(11) 98888-8888' })
  @IsString()
  userPhone: string;

  @ApiProperty({ example: 'senha123' })
  @IsString()
  @MinLength(6)
  password: string;
}
