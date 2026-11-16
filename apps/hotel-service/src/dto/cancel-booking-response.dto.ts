import { ApiProperty } from '@nestjs/swagger';
import { BookingStatus } from '@t-amada/common';

export class CancelBookingResponseDto {
  @ApiProperty({
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    description: 'UUID of the booking',
  })
  id: string;

  @ApiProperty({
    enum: BookingStatus,
    example: BookingStatus.CANCELLED,
    description: 'Booking status',
  })
  status: BookingStatus;

  @ApiProperty({
    example: '2026-11-16T18:00:00.000Z',
    description: 'Booking update timestamp',
  })
  updatedAt: Date | string;
}
