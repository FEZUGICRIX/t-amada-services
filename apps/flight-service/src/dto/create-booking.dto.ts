import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseCreateBookingDto } from '@t-amada/common';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateBookingDto extends BaseCreateBookingDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'Number of passenger seats to book',
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

export class CreateFlightBookingDto extends CreateBookingDto {}
