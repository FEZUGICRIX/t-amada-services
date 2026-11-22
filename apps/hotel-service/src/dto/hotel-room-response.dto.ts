import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class HotelRoomResponseDto {
  @ApiProperty({
    example: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    description: 'Unique room type identifier',
  })
  id: string;

  @ApiProperty({
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    description: 'Parent hotel identifier',
  })
  hotelId: string;

  @ApiProperty({
    example: 'Стандарт двухместный',
    description: 'Room type name',
  })
  name: string;

  @ApiPropertyOptional({
    example: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32',
    nullable: true,
    description: 'Room photo URL',
  })
  imageUrl: string | null;

  @ApiProperty({
    example: 2,
    description: 'Maximum number of adults',
  })
  capacityAdults: number;

  @ApiProperty({
    example: 1,
    description: 'Maximum number of children',
  })
  capacityChildren: number;

  @ApiProperty({
    example: true,
    description: 'Whether breakfast is included',
  })
  hasBreakfast: boolean;

  @ApiProperty({
    example: false,
    description: 'Whether free cancellation is available',
  })
  hasFreeCancellation: boolean;

  @ApiProperty({
    example: ['Вид на море', 'Двуспальная кровать', 'Балкон'],
    type: [String],
    description: 'List of room tags and amenities',
  })
  tags: string[];

  @ApiProperty({
    example: 10,
    description: 'Number of available rooms of this type',
  })
  availableRooms: number;

  @ApiProperty({
    example: '4500.00',
    description: 'Price per night for this room type',
  })
  pricePerNight: string;

  @ApiPropertyOptional({
    example: '22500.00',
    description: 'Calculated total price for the stay period',
  })
  totalPrice?: string;
}
