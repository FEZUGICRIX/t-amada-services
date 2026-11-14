import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseCreateBookingDto } from '@t-amada/common';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class BookFlightDto extends BaseCreateBookingDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'Number of adult passengers (age 12+)',
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'adultsCount must be an integer' })
  @Min(1, { message: 'adultsCount must be at least 1' })
  adultsCount?: number;

  @ApiPropertyOptional({
    example: 0,
    description: 'Number of child passengers (age 2-12)',
    default: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'childrenCount must be an integer' })
  @Min(0, { message: 'childrenCount must be at least 0' })
  childrenCount?: number;

  @ApiPropertyOptional({
    example: 0,
    description: 'Number of infant passengers (<2 years old, no seat)',
    default: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'infantsCount must be an integer' })
  @Min(0, { message: 'infantsCount must be at least 0' })
  infantsCount?: number;

  @ApiPropertyOptional({
    example: 1,
    description:
      'Number of passenger seats to book (deprecated in favor of adultsCount + childrenCount)',
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'passengersCount must be an integer' })
  @Min(1, { message: 'passengersCount must be at least 1' })
  passengersCount?: number;

  @ApiPropertyOptional({
    example: 'ECONOMY',
    enum: ['ECONOMY', 'BUSINESS'],
    description: 'Requested flight service class',
  })
  @IsOptional()
  @IsString({ message: 'flightClass must be a string' })
  @IsIn(['ECONOMY', 'BUSINESS'], { message: 'flightClass must be either ECONOMY or BUSINESS' })
  flightClass?: string;
}

export class CreateBookingDto extends BookFlightDto {}

export class CreateFlightBookingDto extends BookFlightDto {}
