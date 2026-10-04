import { Injectable } from '@nestjs/common';

export interface HealthCheckResult {
  status: 'ok';
  service: string;
  timestamp: string;
}

@Injectable()
export class AppService {
  getHealth(): HealthCheckResult {
    return {
      status: 'ok',
      service: process.env.SERVICE_NAME || 'transfer-service',
      timestamp: new Date().toISOString(),
    };
  }
}
