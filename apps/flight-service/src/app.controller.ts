import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService, HealthResponseDto } from './app.service';
import { FlightResponseDto } from './dto/flight-response.dto';
import { SearchFlightsDto } from './dto/search-flights.dto';

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
  @ApiTags('Flights')
  @ApiOperation({ summary: 'Search available flights' })
  @ApiOkResponse({ type: [FlightResponseDto] })
  async searchFlights(@Query() query: SearchFlightsDto): Promise<FlightResponseDto[]> {
    return this.appService.searchFlights(query);
  }
}
