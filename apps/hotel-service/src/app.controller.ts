import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { HealthResponseDto } from '@t-amada/common';
import { AppService } from './app.service';
import { BookingResponseDto } from './dto/booking-response.dto';
import { CancelBookingResponseDto } from './dto/cancel-booking-response.dto';
import { CancelBookingDto } from './dto/cancel-booking.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { GetHotelRoomsDto } from './dto/get-hotel-rooms.dto';
import { HotelResponseDto } from './dto/hotel-response.dto';
import { HotelRoomResponseDto } from './dto/hotel-room-response.dto';
import { SearchHotelsDto } from './dto/search-hotels.dto';

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

  @Get('search')
  @ApiTags('Hotels')
  @ApiOperation({ summary: 'Search available hotels' })
  @ApiOkResponse({ type: [HotelResponseDto] })
  async searchHotels(@Query() query: SearchHotelsDto): Promise<HotelResponseDto[]> {
    return this.appService.searchHotels(query);
  }

  @Get(':id/rooms')
  @ApiTags('Hotels')
  @ApiOperation({ summary: 'Get available room types for a hotel' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid', description: 'Hotel UUID' })
  @ApiOkResponse({
    type: [HotelRoomResponseDto],
    description: 'List of available room types for the hotel',
  })
  @ApiNotFoundResponse({ description: 'Hotel not found (404)' })
  async getHotelRooms(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Query() query: GetHotelRoomsDto,
  ): Promise<HotelRoomResponseDto[]> {
    return this.appService.getHotelRooms(id, query);
  }

  @Post('book')
  @ApiTags('Bookings')
  @ApiOperation({ summary: 'Book a specific room type (forward Saga step)' })
  @ApiOkResponse({
    type: BookingResponseDto,
    description: 'Booking successfully created (flat object)',
  })
  @ApiBadRequestResponse({ description: 'DTO validation error (400)' })
  @ApiNotFoundResponse({ description: 'Room type not found (404)' })
  @ApiConflictResponse({ description: 'Not enough available rooms (409)' })
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
