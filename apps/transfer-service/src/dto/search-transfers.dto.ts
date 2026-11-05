import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class SearchTransfersDto {
  @ApiPropertyOptional({
    description: 'Pickup location (e.g. Аэропорт Адлер or SVO)',
    example: 'Аэропорт Адлер',
  })
  @IsOptional()
  @IsString()
  pickupLocation?: string;

  @ApiPropertyOptional({
    description: 'Dropoff destination (e.g. Отель Рэдиссон)',
    example: 'Отель Рэдиссон',
  })
  @IsOptional()
  @IsString()
  dropoffLocation?: string;

  @ApiPropertyOptional({
    description: 'Number of passengers requiring transfer',
    example: 3,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  passengersCount?: number;

  @ApiPropertyOptional({
    description: 'Transfer route type',
    enum: ['ONE_WAY', 'ROUND_TRIP'],
    example: 'ONE_WAY',
  })
  @IsOptional()
  @IsIn(['ONE_WAY', 'ROUND_TRIP'])
  routeType?: 'ONE_WAY' | 'ROUND_TRIP';

  @ApiPropertyOptional({
    description: 'Minimum transfer price',
    example: 1500,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({
    description: 'Maximum transfer price',
    example: 6000,
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

  @ApiPropertyOptional({
    description: 'Vehicle model name filter',
    example: 'Mercedes',
  })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiPropertyOptional({
    description: 'Minimum required vehicle capacity',
    example: 4,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  capacity?: number;
}
