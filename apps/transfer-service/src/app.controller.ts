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
import { SearchTransfersDto } from './dto/search-transfers.dto';
import { TransferResponseDto } from './dto/transfer-response.dto';

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
  @ApiTags('Transfers')
  @ApiOperation({ summary: 'Search available transfers' })
  @ApiOkResponse({ type: [TransferResponseDto] })
  async searchTransfers(@Query() query: SearchTransfersDto): Promise<TransferResponseDto[]> {
    return this.appService.searchTransfers(query);
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
  @ApiConflictResponse({ description: 'Resource unavailable / no capacity left (409)' })
  async book(@Body() dto: CreateBookingDto): Promise<BookingResponseDto> {
    return this.appService.bookTransfer(dto);
  }

  @Post('cancel')
  @ApiTags('Bookings')
  @ApiOperation({ summary: 'Compensating booking cancellation step (Saga Cancel)' })
  @ApiOkResponse({ type: CancelBookingResponseDto })
  @ApiNotFoundResponse({ description: 'Booking not found (404)' })
  @ApiBadRequestResponse({ description: 'Input validation error (400)' })
  async cancel(@Body() dto: CancelBookingDto): Promise<CancelBookingResponseDto> {
    return this.appService.cancelTransfer(dto);
  }
}
