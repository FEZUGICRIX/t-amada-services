import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class InsuranceResponseDto {
  @ApiProperty({
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    description: 'Unique policy identifier',
  })
  id: string;

  @ApiProperty({
    example: 'Стандартная медицинская страховка',
    description: 'Insurance policy name/title',
  })
  title: string;

  @ApiProperty({
    example: 'BASIC',
    enum: ['BASIC', 'EXTENDED'],
    description: 'Insurance tier plan type',
  })
  planType: string;

  @ApiProperty({
    example: '2000000.00',
    description: 'Maximum coverage limit in currency units',
  })
  coverageAmount: string;

  @ApiProperty({
    example: ['Экстренная медицинская помощь', 'Лекарства', 'Экстренная стоматология'],
    type: [String],
    description: 'List of covered risks and medical situations',
  })
  coveredRisks: string[];

  @ApiPropertyOptional({
    example: 'Хронические заболевания, солнечные ожоги, экстремальный спорт',
    description: 'List of exclusions and non-covered events',
  })
  exclusions?: string | null;

  @ApiProperty({
    example: '2500.00',
    description: 'Insurance policy base price in currency units',
  })
  price: string;

  @ApiPropertyOptional({
    example: '2500.00',
    description: 'Base price per insured person',
  })
  basePrice?: string;

  @ApiPropertyOptional({
    example: '5000.00',
    description: 'Calculated total price (basePrice * passengersCount)',
  })
  totalPrice?: string;

  @ApiPropertyOptional({
    example: 2,
    description: 'Number of passengers used for total price calculation',
  })
  passengersCount?: number;
}
