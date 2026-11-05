import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class SearchInsurancesDto {
  @ApiPropertyOptional({
    description: 'Insurance tier plan type',
    enum: ['BASIC', 'EXTENDED'],
    example: 'BASIC',
  })
  @IsOptional()
  @IsIn(['BASIC', 'EXTENDED'])
  planType?: 'BASIC' | 'EXTENDED';

  @ApiPropertyOptional({
    description: 'Number of passengers/insured persons to calculate total price',
    example: 2,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  passengersCount?: number;

  @ApiPropertyOptional({
    description: 'Insurance policy title filter',
    example: 'Медицинский',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Minimum insurance price',
    example: 1000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({
    description: 'Maximum insurance price',
    example: 5000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional({
    description: 'Sorting criteria by price',
    enum: ['price_asc', 'price_desc', 'default'],
    default: 'default',
    example: 'price_asc',
  })
  @IsOptional()
  @IsIn(['price_asc', 'price_desc', 'default'])
  sortBy?: 'price_asc' | 'price_desc' | 'default' = 'default';
}
