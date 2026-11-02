import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { and, eq, gte, ilike, lte, sql, SQL } from 'drizzle-orm';
import { BookingStatus } from '@t-amada/common';
import { DRIZZLE, DrizzleDB } from './db/database.module';
import { flightBookings, flights } from './db/schema';
import { BookingResponseDto } from './dto/booking-response.dto';
import { CancelBookingResponseDto } from './dto/cancel-booking-response.dto';
import { CancelBookingDto } from './dto/cancel-booking.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { FlightResponseDto } from './dto/flight-response.dto';
import { SearchFlightsDto } from './dto/search-flights.dto';

export class HealthResponseDto {
  @ApiProperty({ example: 'ok', description: 'Health check status' })
  status: 'ok';

  @ApiProperty({ example: 'flight-service', description: 'Microservice name' })
  service: string;

  @ApiProperty({ example: '2026-11-02T16:30:00.000Z', description: 'Current server ISO timestamp' })
  timestamp: string;
}

@Injectable()
export class AppService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  getHealth(): HealthResponseDto {
    return {
      status: 'ok',
      service: process.env.SERVICE_NAME || 'flight-service',
      timestamp: new Date().toISOString(),
    };
  }

  async searchFlights(query: SearchFlightsDto): Promise<FlightResponseDto[]> {
    const conditions: SQL[] = [gte(flights.availableSeats, query.minSeats ?? 1)];

    if (query.flightNumber) {
      conditions.push(ilike(flights.flightNumber, `%${query.flightNumber}%`));
    }
    if (query.maxPrice !== undefined) {
      conditions.push(lte(flights.price, query.maxPrice.toString()));
    }

    return this.db
      .select({
        id: flights.id,
        flightNumber: flights.flightNumber,
        airlineCode: flights.airlineCode,
        airlineName: flights.airlineName,
        departureCity: flights.departureCity,
        arrivalCity: flights.arrivalCity,
        departureTime: flights.departureTime,
        arrivalTime: flights.arrivalTime,
        hasBaggage: flights.hasBaggage,
        baggageWeightKg: flights.baggageWeightKg,
        flightClass: flights.flightClass,
        flightType: flights.flightType,
        availableSeats: flights.availableSeats,
        price: flights.price,
      })
      .from(flights)
      .where(and(...conditions));
  }

  async bookFlight(dto: CreateBookingDto): Promise<BookingResponseDto> {
    const requestedSeats = dto.passengersCount ?? 1;

    return this.db.transaction(async (tx) => {
      const [flight] = await tx
        .select()
        .from(flights)
        .where(eq(flights.id, dto.resourceId))
        .limit(1);

      if (!flight) {
        throw new NotFoundException('Flight not found');
      }

      if (flight.availableSeats < requestedSeats) {
        throw new ConflictException(
          `Not enough available seats: requested ${requestedSeats}, available ${flight.availableSeats}`,
        );
      }

      await tx
        .update(flights)
        .set({
          availableSeats: sql`${flights.availableSeats} - ${requestedSeats}`,
        })
        .where(eq(flights.id, dto.resourceId));

      const [booking] = await tx
        .insert(flightBookings)
        .values({
          flightId: dto.resourceId,
          bookingReference: dto.bookingReference,
          passengersCount: requestedSeats,
          flightClass: dto.flightClass ?? flight.flightClass,
          status: BookingStatus.CONFIRMED,
        })
        .returning();

      return {
        id: booking.id,
        bookingReference: booking.bookingReference,
        status: booking.status,
        passengersCount: booking.passengersCount,
        flightClass: booking.flightClass,
        createdAt: booking.createdAt,
      };
    });
  }

  async cancelFlight(dto: CancelBookingDto): Promise<CancelBookingResponseDto> {
    return this.db.transaction(async (tx) => {
      const [booking] = await tx
        .select()
        .from(flightBookings)
        .where(eq(flightBookings.id, dto.bookingId))
        .limit(1);

      if (!booking) {
        throw new NotFoundException('Booking not found');
      }

      if (booking.status === BookingStatus.CANCELLED) {
        return {
          id: booking.id,
          status: booking.status,
          updatedAt: new Date().toISOString(),
        };
      }

      const seatsToRestore = booking.passengersCount ?? 1;

      await tx
        .update(flights)
        .set({
          availableSeats: sql`${flights.availableSeats} + ${seatsToRestore}`,
        })
        .where(eq(flights.id, booking.flightId));

      await tx
        .update(flightBookings)
        .set({
          status: BookingStatus.CANCELLED,
        })
        .where(eq(flightBookings.id, booking.id));

      return {
        id: booking.id,
        status: BookingStatus.CANCELLED,
        updatedAt: new Date().toISOString(),
      };
    });
  }
}
