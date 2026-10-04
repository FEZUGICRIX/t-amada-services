import { Controller, Get } from '@nestjs/common';
import { AppService, HealthCheckResult } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  getHealth(): HealthCheckResult {
    return this.appService.getHealth();
  }
}
