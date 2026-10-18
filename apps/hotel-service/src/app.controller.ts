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
import { CancelBookingResponseDto } from './dto/cancel-booking-response.dto';
import { CancelBookingDto } from './dto/cancel-booking.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
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

  @Post('book')
  @ApiTags('Bookings')
  @ApiOperation({ summary: 'Resource booking (forward Saga step)' })
  @ApiOkResponse({
    type: BookingResponseDto,
    description: 'Booking successfully created (flat object)',
  })
  @ApiBadRequestResponse({ description: 'DTO validation error (400)' })
  @ApiNotFoundResponse({ description: 'Resource not found (404)' })
  @ApiConflictResponse({ description: 'Resource unavailable / no rooms left (409)' })
  async book(@Body() dto: CreateBookingDto): Promise<BookingResponseDto> {
    return this.appService.bookHotel(dto);
  }

  @Post('cancel')
  @ApiTags('Bookings')
  @ApiOperation({ summary: 'Compensating booking cancellation step (Saga Cancel)' })
  @ApiOkResponse({ type: CancelBookingResponseDto })
  @ApiNotFoundResponse({ description: 'Booking not found (404)' })
  @ApiBadRequestResponse({ description: 'Input validation error (400)' })
  async cancel(@Body() dto: CancelBookingDto): Promise<CancelBookingResponseDto> {
    return this.appService.cancelHotel(dto);
  }
}
