import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class HotelResponseDto {
  @ApiProperty({
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    description: 'Unique hotel identifier',
  })
  id: string;

  @ApiProperty({
    example: 'Radisson Blu Resort & Congress Centre',
    description: 'Hotel name',
  })
  name: string;

  @ApiProperty({
    example: 5,
    minimum: 1,
    maximum: 5,
    description: 'Hotel star rating (1 to 5)',
  })
  stars: number;

  @ApiPropertyOptional({
    example: 'Первая линия, 100 м до моря',
    description: 'Key location description / tag',
  })
  locationTag?: string | null;

  @ApiPropertyOptional({
    example: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
    description: 'Hotel photo URL',
  })
  imageUrl?: string | null;

  @ApiProperty({
    example: true,
    description: 'Whether breakfast is included in room price',
  })
  hasBreakfast: boolean;

  @ApiProperty({
    example: true,
    description: 'Whether booking offers free cancellation',
  })
  hasFreeCancellation: boolean;

  @ApiProperty({
    example: 50,
    description: 'Available rooms of this type',
  })
  availableRooms: number;

  @ApiProperty({
    example: '9500.00',
    description: 'Price per night in currency units',
  })
  pricePerNight: string;
}
