import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CancelBookingDto {
  @ApiProperty({
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    description: 'UUID of the booking to cancel',
  })
  @IsUUID(4, { message: 'bookingId must be a UUID' })
  @IsNotEmpty({ message: 'bookingId should not be empty' })
  @IsString()
  bookingId: string;
}
