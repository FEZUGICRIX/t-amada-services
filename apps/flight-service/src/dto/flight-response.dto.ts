import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FlightResponseDto {
  @ApiProperty({
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    description: 'Unique flight identifier',
  })
  id: string;

  @ApiProperty({
    example: 'SU-1120',
    description: 'Flight code/number',
  })
  flightNumber: string;

  @ApiProperty({
    example: 'SU',
    description: 'IATA airline code',
  })
  airlineCode: string;

  @ApiProperty({
    example: 'Аэрофлот',
    description: 'Airline company name',
  })
  airlineName: string;

  @ApiProperty({
    example: 'Москва',
    description: 'Departure city',
  })
  departureCity: string;

  @ApiProperty({
    example: 'Сочи',
    description: 'Arrival city',
  })
  arrivalCity: string;

  @ApiProperty({
    example: '2026-11-10T08:30:00.000Z',
    description: 'Departure timestamp with timezone',
  })
  departureTime: Date | string;

  @ApiProperty({
    example: '2026-11-10T12:30:00.000Z',
    description: 'Arrival timestamp with timezone',
  })
  arrivalTime: Date | string;

  @ApiProperty({
    example: true,
    description: 'Whether checked baggage is included',
  })
  hasBaggage: boolean;

  @ApiPropertyOptional({
    example: 23,
    description: 'Baggage allowance in kg (null if no baggage)',
  })
  baggageWeightKg?: number | null;

  @ApiProperty({
    example: 'ECONOMY',
    enum: ['ECONOMY', 'BUSINESS'],
    description: 'Flight service class',
  })
  flightClass: string;

  @ApiPropertyOptional({
    example: 'OUTBOUND',
    description: 'Flight route type / direction',
  })
  flightType?: string | null;

  @ApiProperty({
    example: 150,
    description: 'Number of currently available seats',
  })
  availableSeats: number;

  @ApiProperty({
    example: '8500.00',
    description: 'Ticket price in currency units',
  })
  price: string;
}
