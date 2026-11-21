import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Matches, Min } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({
    example: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    description: 'UUID of the hotel room type (hotel_rooms.id) to book',
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

  @ApiPropertyOptional({
    example: 1,
    default: 1,
    description: 'Number of rooms to book (default 1)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  roomsCount?: number;

  @ApiProperty({
    example: '2026-11-20',
    description: 'Check-in date (YYYY-MM-DD)',
  })
  @IsNotEmpty({ message: 'checkIn is required' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'checkIn must be in YYYY-MM-DD format',
  })
  checkIn: string;

  @ApiProperty({
    example: '2026-11-25',
    description: 'Check-out date (YYYY-MM-DD)',
  })
  @IsNotEmpty({ message: 'checkOut is required' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'checkOut must be in YYYY-MM-DD format',
  })
  checkOut: string;
}
