import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { BookingStatus } from '../enums/booking-status.enum';

export class BaseCreateBookingDto {
  @ApiProperty({
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    description: 'UUID of the selected resource to book',
  })
  @IsUUID(4, { message: 'resourceId must be a UUID' })
  @IsNotEmpty()
  resourceId: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Booking reference / step ID from the saga orchestrator',
  })
  @IsNotEmpty({ message: 'bookingReference should not be empty' })
  @IsString()
  bookingReference: string;
}

export class BaseBookingResponseDto {
  @ApiProperty({
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    description: 'Unique booking identifier in the microservice',
  })
  id: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Booking reference / step ID from orchestrator',
  })
  bookingReference: string;

  @ApiProperty({
    enum: BookingStatus,
    example: BookingStatus.CONFIRMED,
    description: 'Booking status',
  })
  status: BookingStatus;

  @ApiProperty({
    example: '2026-10-18T12:00:00.000Z',
    description: 'Booking creation timestamp',
  })
  createdAt: Date | string;
}

export class BaseCancelBookingDto {
  @ApiProperty({
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    description: 'UUID of the booking to cancel',
  })
  @IsUUID(4, { message: 'bookingId must be a UUID' })
  @IsNotEmpty({ message: 'bookingId should not be empty' })
  @IsString()
  bookingId: string;
}

export class BaseCancelBookingResponseDto {
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
    example: '2026-10-19T18:00:00.000Z',
    description: 'Booking update timestamp',
  })
  updatedAt: Date | string;
}
