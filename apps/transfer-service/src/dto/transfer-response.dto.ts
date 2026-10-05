import { ApiProperty } from '@nestjs/swagger';

export class TransferResponseDto {
  @ApiProperty({ example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
  id: string;

  @ApiProperty({ example: 'Mercedes-Benz V-Class' })
  model: string;

  @ApiProperty({ example: 6 })
  capacity: number;

  @ApiProperty({ example: '4500.00' })
  price: string;
}
