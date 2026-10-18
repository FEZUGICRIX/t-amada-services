import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { BookingStatus } from '@t-amada/common';

export class BookingResponseDto {
  @ApiProperty({
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    description: 'Unique booking identifier',
  })
  id: string;

  @ApiProperty({
    example: 'BOOK-HOTEL-12345',
    description: 'Booking reference identifier from orchestrator',
  })
  bookingReference: string;

  @ApiProperty({
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    description: 'ID of the booked hotel',
  })
  hotelId: string;

  @ApiProperty({
    enum: BookingStatus,
    example: BookingStatus.CONFIRMED,
    description: 'Current booking status',
  })
  @IsEnum(BookingStatus)
  status: BookingStatus;

  @ApiProperty({
    example: '2026-10-11T12:00:00.000Z',
    description: 'Booking creation timestamp',
  })
  createdAt: Date | string;
}

export class HotelBookingResponseDto extends BookingResponseDto {}
