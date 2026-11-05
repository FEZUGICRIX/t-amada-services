import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class SearchHotelsDto {
  @ApiPropertyOptional({
    description: 'City or location of the hotel (searched in locationTag or name)',
    example: 'Сочи',
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({
    description: 'Check-in date in ISO 8601 format (e.g. 2026-11-10)',
    example: '2026-11-10',
  })
  @IsOptional()
  @IsISO8601()
  checkInDate?: string;

  @ApiPropertyOptional({
    description: 'Check-out date in ISO 8601 format (e.g. 2026-11-15)',
    example: '2026-11-15',
  })
  @IsOptional()
  @IsISO8601()
  checkOutDate?: string;

  @ApiPropertyOptional({
    description: 'Hotel star ratings (e.g. 4,5 or ?stars=4&stars=5)',
    example: [4, 5],
    oneOf: [
      { type: 'string', example: '4,5' },
      { type: 'array', items: { type: 'number' }, example: [4, 5] },
    ],
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') return undefined;
    const items = Array.isArray(value) ? value : String(value).split(',');
    const numbers = items
      .map((val: unknown) => Number(String(val).trim()))
      .filter((n) => !isNaN(n));
    return numbers.length > 0 ? numbers : undefined;
  })
  @IsArray()
  @IsInt({ each: true })
  stars?: number[];

  @ApiPropertyOptional({
    description: 'Filter hotels with breakfast included',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') return undefined;
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return value;
  })
  @IsBoolean()
  hasBreakfast?: boolean;

  @ApiPropertyOptional({
    description: 'Filter hotels with free cancellation',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') return undefined;
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return value;
  })
  @IsBoolean()
  hasFreeCancellation?: boolean;

  @ApiPropertyOptional({
    description: 'Minimum price per night',
    example: 3000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({
    description: 'Maximum price per night',
    example: 15000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional({
    description: 'Sorting criteria by price per night',
    enum: ['price_asc', 'price_desc', 'default'],
    default: 'default',
    example: 'price_asc',
  })
  @IsOptional()
  @IsIn(['price_asc', 'price_desc', 'default'])
  sortBy?: 'price_asc' | 'price_desc' | 'default' = 'default';

  @ApiPropertyOptional({
    description: 'Hotel name filter',
    example: 'Radisson',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Minimum required available rooms',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  minRooms?: number;

  @ApiPropertyOptional({
    description: 'Maximum price per night (legacy parameter alias for maxPrice)',
    example: 15000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPricePerNight?: number;
}
