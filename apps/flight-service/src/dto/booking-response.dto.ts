import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseBookingResponseDto } from '@t-amada/common';

export class BookingResponseDto extends BaseBookingResponseDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'Number of passenger seats booked',
  })
  passengersCount?: number;

  @ApiPropertyOptional({
    example: 'ECONOMY',
    description: 'Booked flight service class',
  })
  flightClass?: string | null;
}

export class FlightBookingResponseDto extends BookingResponseDto {}
