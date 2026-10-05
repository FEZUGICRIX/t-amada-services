import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService, HealthResponseDto } from './app.service';
import { HotelResponseDto } from './dto/hotel-response.dto';
import { SearchHotelsDto } from './dto/search-hotels.dto';

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
  @ApiTags('Hotels')
  @ApiOperation({ summary: 'Search available hotels' })
  @ApiOkResponse({ type: [HotelResponseDto] })
  async searchHotels(@Query() query: SearchHotelsDto): Promise<HotelResponseDto[]> {
    return this.appService.searchHotels(query);
  }
}
