import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AppService, HealthResponseDto } from './app.service';
import { BookingResponseDto } from './dto/booking-response.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
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

  @Post('book')
  @ApiTags('Bookings')
  @ApiOperation({ summary: 'Бронирование ресурса (прямой шаг Saga)' })
  @ApiOkResponse({
    type: BookingResponseDto,
    description: 'Успешное создание брони (плоский объект)',
  })
  @ApiBadRequestResponse({ description: 'Ошибка валидации DTO (400)' })
  @ApiNotFoundResponse({ description: 'Ресурс не найден (404)' })
  @ApiConflictResponse({ description: 'Ресурс занят / нет мест (409)' })
  async book(@Body() dto: CreateBookingDto): Promise<BookingResponseDto> {
    return this.appService.bookFlight(dto);
  }
}
