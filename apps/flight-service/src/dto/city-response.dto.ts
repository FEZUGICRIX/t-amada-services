import { ApiProperty } from '@nestjs/swagger';

export class CityResponseDto {
  @ApiProperty({
    example: 'Москва',
    description: 'City name',
  })
  name: string;

  @ApiProperty({
    example: 'Россия',
    description: 'Country name',
    default: 'Россия',
  })
  country: string = 'Россия';
}
