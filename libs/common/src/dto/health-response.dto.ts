import { ApiProperty } from '@nestjs/swagger';

export class HealthResponseDto {
  @ApiProperty({ example: 'ok', enum: ['ok', 'error'], description: 'Health check status' })
  status: 'ok' | 'error';

  @ApiProperty({ example: 'flight-service', description: 'Microservice name' })
  service: string;

  @ApiProperty({ example: '2026-11-02T16:30:00.000Z', description: 'Current server ISO timestamp' })
  timestamp: string;
}
