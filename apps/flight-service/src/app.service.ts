import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, eq, gte, ilike, lte, sql, SQL } from 'drizzle-orm';
import { BookingStatus } from '@t-amada/common';
import { DRIZZLE, DrizzleDB } from './db/database.module';
import { flightBookings, flights } from './db/schema';
import { BookingResponseDto } from './dto/booking-response.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { FlightResponseDto } from './dto/flight-response.dto';
import { SearchFlightsDto } from './dto/search-flights.dto';

export interface HealthResponseDto {
  status: 'ok';
  service: string;
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
        availableSeats: flights.availableSeats,
        price: flights.price,
      })
      .from(flights)
      .where(and(...conditions));
  }

  async bookFlight(dto: CreateBookingDto): Promise<BookingResponseDto> {
    return this.db.transaction(async (tx) => {
      const [flight] = await tx
        .select()
        .from(flights)
        .where(eq(flights.id, dto.resourceId))
        .limit(1);

      if (!flight) {
        throw new NotFoundException('Flight not found');
      }

      if (flight.availableSeats <= 0) {
        throw new ConflictException('Flight has no available seats');
      }

      await tx
        .update(flights)
        .set({
          availableSeats: sql`${flights.availableSeats} - 1`,
        })
        .where(eq(flights.id, dto.resourceId));

      const [booking] = await tx
        .insert(flightBookings)
        .values({
          flightId: dto.resourceId,
          bookingReference: dto.bookingReference,
          status: BookingStatus.CONFIRMED,
        })
        .returning();

      return {
        id: booking.id,
        bookingReference: booking.bookingReference,
        status: booking.status,
        createdAt: booking.createdAt,
      };
    });
  }
}
