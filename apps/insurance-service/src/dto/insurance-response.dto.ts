import { ApiProperty } from '@nestjs/swagger';

export class InsuranceResponseDto {
  @ApiProperty({ example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
  id: string;

  @ApiProperty({ example: 'Standard Medical & Baggage Protection' })
  title: string;

  @ApiProperty({ example: '2500.00' })
  price: string;
}
