import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TransferResponseDto {
  @ApiProperty({
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    description: 'Unique vehicle/transfer identifier',
  })
  id: string;

  @ApiProperty({
    example: 'Mercedes-Benz V-Class',
    description: 'Vehicle model name and trim',
  })
  model: string;

  @ApiProperty({
    example: 'MINIVAN',
    enum: ['STANDARD', 'MINIVAN'],
    description: 'Vehicle class category',
  })
  vehicleClass: string;

  @ApiProperty({
    example: 'Минивэн',
    description: 'Localized vehicle body type name',
  })
  vehicleTypeName: string;

  @ApiProperty({
    example: 6,
    description: 'Currently available seats/capacity',
  })
  capacity: number;

  @ApiProperty({
    example: 6,
    description: 'Maximum passenger capacity',
  })
  maxPassengers: number;

  @ApiPropertyOptional({
    example: 'увеличенный багажник, 6 мест багажа',
    description: 'Information about luggage capacity',
  })
  baggageCapacityInfo?: string | null;

  @ApiProperty({
    example: 'ONE_WAY',
    enum: ['ONE_WAY', 'ROUND_TRIP'],
    description: 'Transfer route type (one-way or round-trip)',
  })
  transferRouteType: string;

  @ApiProperty({
    example: '4500.00',
    description: 'Transfer price in currency units',
  })
  price: string;
}
