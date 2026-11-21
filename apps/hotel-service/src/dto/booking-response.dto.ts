import { ApiProperty } from '@nestjs/swagger';
import { BookingStatus } from '@t-amada/common';

export class BookingResponseDto {
  @ApiProperty({
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    description: 'Unique booking identifier',
  })
  id: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Booking reference / step ID from orchestrator',
  })
  bookingReference: string;

  @ApiProperty({
    example: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    description: 'Booked room type identifier',
  })
  roomId: string;

  @ApiProperty({
    example: 1,
    description: 'Number of rooms booked',
  })
  roomsCount: number;

  @ApiProperty({
    example: '2026-11-20',
    description: 'Check-in date (YYYY-MM-DD)',
  })
  checkIn: string;

  @ApiProperty({
    example: '2026-11-25',
    description: 'Check-out date (YYYY-MM-DD)',
  })
  checkOut: string;

  @ApiProperty({
    enum: BookingStatus,
    example: BookingStatus.CONFIRMED,
    description: 'Booking status',
  })
  status: BookingStatus;

  @ApiProperty({
    example: '2026-11-16T12:00:00.000Z',
    description: 'Booking creation timestamp',
  })
  createdAt: Date | string;
}
