import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Min } from 'class-validator';

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
}

export class BookHotelDto extends CreateBookingDto {}
