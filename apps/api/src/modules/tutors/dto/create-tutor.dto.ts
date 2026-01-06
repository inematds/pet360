import { IsString, IsOptional, IsEmail, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTutorDto {
  @ApiProperty({ example: 'Maria Silva' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: '123.456.789-00' })
  @IsOptional()
  @IsString()
  cpf?: string;

  @ApiPropertyOptional({ example: 'maria@email.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: '(11) 99999-9999' })
  @IsString()
  phone: string;

  @ApiPropertyOptional({ example: '(11) 88888-8888' })
  @IsOptional()
  @IsString()
  phone2?: string;

  @ApiPropertyOptional({ example: 'Rua das Flores' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: '123' })
  @IsOptional()
  @IsString()
  number?: string;

  @ApiPropertyOptional({ example: 'Apto 45' })
  @IsOptional()
  @IsString()
  complement?: string;

  @ApiPropertyOptional({ example: 'Centro' })
  @IsOptional()
  @IsString()
  neighborhood?: string;

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

  @ApiPropertyOptional({ example: 'WHATSAPP' })
  @IsOptional()
  @IsString()
  preferredContact?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  acceptsMarketing?: boolean;
}
