import { ApiProperty } from '@nestjs/swagger';

export class HotelResponseDto {
  @ApiProperty({ example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
  id: string;

  @ApiProperty({ example: 'Radisson Blu Resort & Congress Centre' })
  name: string;

  @ApiProperty({ example: 50 })
  availableRooms: number;

  @ApiProperty({ example: '9500.00' })
  pricePerNight: string;
}
