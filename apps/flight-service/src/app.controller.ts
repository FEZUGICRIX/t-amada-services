import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { HealthResponseDto } from '@t-amada/common';
import { AppService } from './app.service';
import { BookingResponseDto } from './dto/booking-response.dto';
import { CancelBookingResponseDto } from './dto/cancel-booking-response.dto';
import { CancelBookingDto } from './dto/cancel-booking.dto';
import { CityResponseDto } from './dto/city-response.dto';
import { BookFlightDto } from './dto/create-booking.dto';
import { FlightResponseDto } from './dto/flight-response.dto';
import { SearchCitiesDto } from './dto/search-cities.dto';
import { SearchFlightsDto } from './dto/search-flights.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  @ApiTags('Health')
  @ApiOperation({ summary: 'Health check' })
  @ApiOkResponse({ type: HealthResponseDto, description: 'Service health status' })
  getHealth(): HealthResponseDto {
    return this.appService.getHealth();
  }

  @Get('cities')
  @ApiTags('Flights')
  @ApiOperation({
    summary: 'Get available flight cities directory and autocomplete suggestions',
    description:
      'Returns a flat list of unique departure and arrival cities, prioritizing popular destinations (Moscow, Yekaterinburg, Saint Petersburg, Sochi) when query is empty.',
  })
  @ApiOkResponse({ type: [CityResponseDto], description: 'Flat list of available cities' })
  @ApiBadRequestResponse({ description: 'DTO validation error (400)' })
  getCities(@Query() query: SearchCitiesDto): Promise<CityResponseDto[]> {
    return this.appService.getCities(query);
  }

  @Get('search')
  @ApiTags('Flights')
  @ApiOperation({ summary: 'Search available flights' })
  @ApiOkResponse({ type: [FlightResponseDto] })
  async searchFlights(@Query() query: SearchFlightsDto): Promise<FlightResponseDto[]> {
    return this.appService.searchFlights(query);
  }

  @Post('book')
  @ApiTags('Bookings')
  @ApiOperation({ summary: 'Resource booking (forward Saga step)' })
  @ApiOkResponse({
    type: BookingResponseDto,
    description: 'Booking successfully created (flat object)',
  })
  @ApiBadRequestResponse({ description: 'DTO validation error (400)' })
  @ApiNotFoundResponse({ description: 'Resource not found (404)' })
  @ApiConflictResponse({ description: 'Resource unavailable / no seats left (409)' })
  async book(@Body() dto: BookFlightDto): Promise<BookingResponseDto> {
    return this.appService.bookFlight(dto);
  }

  @Post('cancel')
  @ApiTags('Bookings')
  @ApiOperation({ summary: 'Compensating booking cancellation step (Saga Cancel)' })
  @ApiOkResponse({ type: CancelBookingResponseDto })
  @ApiNotFoundResponse({ description: 'Booking not found (404)' })
  @ApiBadRequestResponse({ description: 'Input validation error (400)' })
  async cancel(@Body() dto: CancelBookingDto): Promise<CancelBookingResponseDto> {
    return this.appService.cancelFlight(dto);
  }
}
