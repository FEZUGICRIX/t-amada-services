import { Injectable } from '@nestjs/common';

export interface HealthResponseDto {
  status: 'ok';
  service: string;
  timestamp: string;
}

@Injectable()
export class AppService {
  getHealth(): HealthResponseDto {
    return {
      status: 'ok',
      service: process.env.SERVICE_NAME || 'insurance-service',
      timestamp: new Date().toISOString(),
    };
  }
}
