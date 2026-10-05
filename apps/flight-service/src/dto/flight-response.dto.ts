import { ApiProperty } from '@nestjs/swagger';

export class FlightResponseDto {
  @ApiProperty({ example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
  id: string;

  @ApiProperty({ example: 'SU-1120' })
  flightNumber: string;

  @ApiProperty({ example: 150 })
  availableSeats: number;

  @ApiProperty({ example: '8500.00' })
  price: string;
}
