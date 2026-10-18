import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { BookingStatus } from '@t-amada/common';

export class CreateBookingDto {
  @ApiProperty({
    example: 'BOOK-FLIGHT-12345',
    description: 'Booking reference identifier from orchestrator',
  })
  @IsString()
  @IsNotEmpty()
  bookingReference: string;

  @ApiProperty({
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    description: 'ID of the flight to book',
  })
  @IsUUID()
  @IsNotEmpty()
  flightId: string;

  @ApiProperty({
    enum: BookingStatus,
    example: BookingStatus.CONFIRMED,
    required: false,
    description: 'Initial booking status',
  })
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;
}

export class CreateFlightBookingDto extends CreateBookingDto {}
