import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsEmail,
  ValidateNested,
  Min,
  ArrayMinSize,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @ApiProperty({ example: 'listing-uuid' })
  @IsString()
  listingId: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ example: 'Joao Silva' })
  @IsString()
  buyerName: string;

  @ApiProperty({ example: 'joao@email.com' })
  @IsEmail()
  buyerEmail: string;

  @ApiProperty({ example: '(11) 99999-9999' })
  @IsString()
  buyerPhone: string;

  @ApiPropertyOptional({ example: '123.456.789-00' })
  @IsOptional()
  @IsString()
  buyerCpf?: string;

  @ApiProperty({ example: 'Rua das Flores, 123' })
  @IsString()
  shippingAddress: string;

  @ApiProperty({ example: 'Sao Paulo' })
  @IsString()
  shippingCity: string;

  @ApiProperty({ example: 'SP' })
  @IsString()
  shippingState: string;

  @ApiProperty({ example: '01234-567' })
  @IsString()
  shippingZipCode: string;

  @ApiPropertyOptional({ example: 25.00 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  shippingCost?: number;

  @ApiPropertyOptional({ example: 10.00 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discount?: number;

  @ApiProperty({ example: 'PIX' })
  @IsString()
  paymentMethod: string;

  @ApiPropertyOptional({ example: 'Entregar no portao' })
  @IsOptional()
  @IsString()
  notes?: string;
}
