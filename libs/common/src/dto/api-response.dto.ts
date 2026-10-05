import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T = unknown> {
  @ApiProperty({ example: true })
  readonly success: boolean;

  readonly data: T;

  @ApiProperty({ example: '2026-10-05T12:00:00.000Z' })
  readonly timestamp: string;

  constructor(data: T) {
    this.success = true;
    this.data = data;
    this.timestamp = new Date().toISOString();
  }
}
