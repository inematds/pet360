import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsEmail,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ example: 'Joao Silva' })
  @IsString()
  buyerName: string;

  @ApiProperty({ example: 'joao@email.com' })
  @IsEmail()
  buyerEmail: string;

  @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({ example: 'Otimo produto!' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'Meu cachorro adorou, recomendo!' })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiPropertyOptional({ example: ['https://example.com/review-photo.jpg'] })
  @IsOptional()
  @IsArray()
  photos?: string[];
}
