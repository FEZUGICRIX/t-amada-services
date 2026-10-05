import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService, HealthResponseDto } from './app.service';
import { InsuranceResponseDto } from './dto/insurance-response.dto';
import { SearchInsurancesDto } from './dto/search-insurances.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  @ApiTags('Health')
  @ApiOperation({ summary: 'Health check' })
  getHealth(): HealthResponseDto {
    return this.appService.getHealth();
  }

  @Get('search')
  @ApiTags('Insurances')
  @ApiOperation({ summary: 'Search insurance policies' })
  @ApiOkResponse({ type: [InsuranceResponseDto] })
  async searchInsurances(@Query() query: SearchInsurancesDto): Promise<InsuranceResponseDto[]> {
    return this.appService.searchInsurances(query);
  }
}
