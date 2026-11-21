import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, Matches } from 'class-validator';

export class GetHotelRoomsDto {
  @ApiPropertyOptional({
    description: 'Check-in date (YYYY-MM-DD)',
    example: '2026-11-20',
  })
  @IsOptional()
  @IsDateString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'checkIn must be in YYYY-MM-DD format',
  })
  checkIn?: string;

  @ApiPropertyOptional({
    description: 'Check-out date (YYYY-MM-DD)',
    example: '2026-11-25',
  })
  @IsOptional()
  @IsDateString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'checkOut must be in YYYY-MM-DD format',
  })
  checkOut?: string;
}
