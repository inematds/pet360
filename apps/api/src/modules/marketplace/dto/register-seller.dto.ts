import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum SellerType {
  INDIVIDUAL = 'INDIVIDUAL',
  COMPANY = 'COMPANY',
}

export class RegisterSellerDto {
  @ApiProperty({ example: 'Maria Pet Shop' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'maria@petshop.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '(11) 99999-9999' })
  @IsString()
  phone: string;

  @ApiProperty({ example: '123.456.789-00' })
  @IsString()
  cpfCnpj: string;

  @ApiPropertyOptional({ example: 'Pet Shop da Maria LTDA' })
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiPropertyOptional({ example: 'Vendemos produtos premium para pets' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'Rua das Flores, 123' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: 'Sao Paulo' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: 'SP' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ example: '01234-567' })
  @IsOptional()
  @IsString()
  zipCode?: string;

  @ApiProperty({ enum: SellerType, example: 'INDIVIDUAL' })
  @IsEnum(SellerType)
  sellerType: SellerType;
}
