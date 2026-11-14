import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseBookingResponseDto } from '@t-amada/common';

export class BookingResponseDto extends BaseBookingResponseDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'Number of passenger seats booked (adultsCount + childrenCount)',
  })
  passengersCount?: number;

  @ApiPropertyOptional({
    example: 'ECONOMY',
    description: 'Booked flight service class',
  })
  flightClass?: string | null;

  @ApiPropertyOptional({
    example: 1,
    description: 'Number of adult passengers',
  })
  adultsCount?: number;

  @ApiPropertyOptional({
    example: 0,
    description: 'Number of child passengers',
  })
  childrenCount?: number;

  @ApiPropertyOptional({
    example: 0,
    description: 'Number of infant passengers',
  })
  infantsCount?: number;
}

export class FlightBookingResponseDto extends BookingResponseDto {}
