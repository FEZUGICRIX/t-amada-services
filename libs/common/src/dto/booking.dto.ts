import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BookingStatus } from '../enums/booking-status.enum';

export class BaseCreateBookingDto {
  @ApiProperty({
    example: 'BOOK-REF-12345',
    description: 'Booking reference identifier from orchestrator',
  })
  @IsString()
  @IsNotEmpty()
  bookingReference: string;

  @ApiProperty({
    enum: BookingStatus,
    example: BookingStatus.CONFIRMED,
    required: false,
    description: 'Booking status',
  })
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;
}

export class BaseBookingResponseDto {
  @ApiProperty({
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    description: 'Unique booking identifier',
  })
  id: string;

  @ApiProperty({
    example: 'BOOK-REF-12345',
    description: 'Booking reference identifier from orchestrator',
  })
  bookingReference: string;

  @ApiProperty({
    enum: BookingStatus,
    example: BookingStatus.CONFIRMED,
    description: 'Booking status',
  })
  @IsEnum(BookingStatus)
  status: BookingStatus;

  @ApiProperty({
    example: '2026-10-11T12:00:00.000Z',
    description: 'Booking creation timestamp',
  })
  createdAt: Date | string;
}
