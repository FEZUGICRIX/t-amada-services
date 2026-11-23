import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Min,
} from 'class-validator';

export class SearchFlightsDto {
  @ApiPropertyOptional({
    description: 'City or airport code of departure (e.g. Москва, SVO)',
    example: 'Москва',
  })
  @IsOptional()
  @IsString()
  origin?: string;

  @ApiPropertyOptional({
    description: 'City or airport code of arrival (e.g. Сочи, AER)',
    example: 'Сочи',
  })
  @IsOptional()
  @IsString()
  destination?: string;

  @ApiPropertyOptional({
    description:
      'Departure date in YYYY-MM-DD format filtered strictly by Moscow time (Europe/Moscow, UTC+3) (e.g. 2026-11-15)',
    example: '2026-11-15',
  })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'date must be in YYYY-MM-DD format (e.g. 2026-11-15)',
  })
  date?: string;

  @ApiPropertyOptional({
    description: 'Flight service class',
    enum: ['ECONOMY', 'BUSINESS'],
    example: 'ECONOMY',
  })
  @IsOptional()
  @IsEnum(['ECONOMY', 'BUSINESS'])
  flightClass?: 'ECONOMY' | 'BUSINESS';

  @ApiPropertyOptional({
    description: 'Airline codes or names (comma-separated string or array, e.g. SU,DP,S7)',
    example: 'SU,DP,S7',
    oneOf: [
      { type: 'string', example: 'SU,DP,S7' },
      { type: 'array', items: { type: 'string' }, example: ['SU', 'DP'] },
    ],
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') return undefined;
    const arr = Array.isArray(value) ? value : String(value).split(',');
    const cleaned = arr.map((item: unknown) => String(item).trim()).filter(Boolean);
    return cleaned.length > 0 ? cleaned : undefined;
  })
  @IsArray()
  @IsString({ each: true })
  airlines?: string[];

  @ApiPropertyOptional({
    description: 'Filter flights by baggage inclusion',
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
  hasBaggage?: boolean;

  @ApiPropertyOptional({
    description: 'Filter by route connection type',
    enum: ['all', 'direct', 'with-stops'],
    default: 'all',
    example: 'direct',
  })
  @IsOptional()
  @IsIn(['all', 'direct', 'with-stops'])
  stops?: 'all' | 'direct' | 'with-stops' = 'all';

  @ApiPropertyOptional({
    description: 'Maximum allowed connection stops (e.g. 0 for direct only, 1, 2)',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  maxStops?: number;

  @ApiPropertyOptional({
    description: 'Minimum flight price',
    example: 3000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({
    description: 'Maximum flight price',
    example: 10000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional({
    description: 'Sorting criteria',
    enum: ['price_asc', 'price_desc', 'default'],
    default: 'default',
    example: 'price_asc',
  })
  @IsOptional()
  @IsIn(['price_asc', 'price_desc', 'default'])
  sortBy?: 'price_asc' | 'price_desc' | 'default' = 'default';

  @ApiPropertyOptional({
    description: 'Flight code/number (e.g. SU-1120)',
    example: 'SU-1120',
  })
  @IsOptional()
  @IsString()
  flightNumber?: string;

  @ApiPropertyOptional({
    description: 'Minimum required available seats',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  minSeats?: number;

  @ApiPropertyOptional({
    description: 'Number of adult passengers (age 12+)',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  adultsCount?: number;

  @ApiPropertyOptional({
    description: 'Number of child passengers (age 2-12)',
    example: 0,
    default: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  childrenCount?: number;

  @ApiPropertyOptional({
    description: 'Number of infant passengers (under 2 years old, no seat)',
    example: 0,
    default: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  infantsCount?: number;
}
