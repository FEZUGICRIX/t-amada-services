import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, asc, desc, eq, gte, ilike, inArray, lte, or, sql, SQL } from 'drizzle-orm';
import { BookingStatus, HealthResponseDto } from '@t-amada/common';
import { DRIZZLE, DrizzleDB } from './db/database.module';
import { flightBookings, flights } from './db/schema';
import { BookingResponseDto } from './dto/booking-response.dto';
import { CancelBookingResponseDto } from './dto/cancel-booking-response.dto';
import { CancelBookingDto } from './dto/cancel-booking.dto';
import { CityResponseDto } from './dto/city-response.dto';
import { BookFlightDto } from './dto/create-booking.dto';
import { FlightResponseDto } from './dto/flight-response.dto';
import { SearchCitiesDto } from './dto/search-cities.dto';
import { SearchFlightsDto } from './dto/search-flights.dto';

const POPULAR_CITIES = ['Москва', 'Екатеринбург', 'Санкт-Петербург', 'Сочи'] as const;

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

  async getCities(query: SearchCitiesDto): Promise<CityResponseDto[]> {
    const limit = query.limit && query.limit > 0 ? query.limit : 10;
    const search = query.query?.trim();
    const pattern = search ? `%${search.replace(/[%_\\]/g, '\\$&')}%` : undefined;

    const dep = this.db
      .select({ name: flights.departureCity })
      .from(flights)
      .where(pattern ? ilike(flights.departureCity, pattern) : undefined);

    const arr = this.db
      .select({ name: flights.arrivalCity })
      .from(flights)
      .where(pattern ? ilike(flights.arrivalCity, pattern) : undefined);

    const dbCities = (await dep.union(arr))
      .map((r) => r.name.trim())
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b, 'ru'));

    const matchingPopular = POPULAR_CITIES.filter(
      (city) => !search || city.toLowerCase().includes(search.toLowerCase()),
    );

    const uniqueCities = new Map<string, string>();
    for (const city of [...matchingPopular, ...dbCities]) {
      const key = city.toLowerCase();
      if (!uniqueCities.has(key)) uniqueCities.set(key, city);
    }

    return Array.from(uniqueCities.values())
      .slice(0, limit)
      .map((name) => ({ name, country: 'Россия' }));
  }

  async searchFlights(query: SearchFlightsDto): Promise<FlightResponseDto[]> {
    const adultsCount = query.adultsCount ?? 1;
    const childrenCount = query.childrenCount ?? 0;
    const seatsNeeded = adultsCount + childrenCount;

    const conditions: SQL[] = [gte(flights.availableSeats, seatsNeeded > 0 ? seatsNeeded : 1)];

    if (query.minSeats !== undefined) {
      conditions.push(gte(flights.availableSeats, query.minSeats));
    }

    if (query.origin) {
      conditions.push(ilike(flights.departureCity, `%${query.origin.trim()}%`));
    }

    if (query.destination) {
      conditions.push(ilike(flights.arrivalCity, `%${query.destination.trim()}%`));
    }

    if (query.date) {
      const datePart = query.date.includes('T') ? query.date.split('T')[0] : query.date;
      const startOfDay = new Date(`${datePart}T00:00:00.000+03:00`);
      const endOfDay = new Date(`${datePart}T23:59:59.999+03:00`);

      conditions.push(gte(flights.departureTime, startOfDay));
      conditions.push(lte(flights.departureTime, endOfDay));
    }

    if (query.flightClass) {
      conditions.push(eq(flights.flightClass, query.flightClass));
    }

    if (query.airlines && query.airlines.length > 0) {
      const airlineCodes = Array.from(
        new Set([...query.airlines, ...query.airlines.map((a) => a.toUpperCase())]),
      );
      conditions.push(
        or(
          inArray(flights.airlineCode, airlineCodes),
          inArray(flights.airlineName, query.airlines),
        )!,
      );
    }

    if (query.hasBaggage !== undefined) {
      conditions.push(eq(flights.hasBaggage, query.hasBaggage));
    }

    if (query.minPrice !== undefined) {
      conditions.push(gte(flights.price, query.minPrice.toString()));
    }

    if (query.maxPrice !== undefined) {
      conditions.push(lte(flights.price, query.maxPrice.toString()));
    }

    if (query.flightNumber) {
      conditions.push(ilike(flights.flightNumber, `%${query.flightNumber.trim()}%`));
    }

    let orderByClause: SQL;
    if (query.sortBy === 'price_asc') {
      orderByClause = asc(flights.price);
    } else if (query.sortBy === 'price_desc') {
      orderByClause = desc(flights.price);
    } else {
      orderByClause = asc(flights.departureTime);
    }

    const results = await this.db
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
      .where(and(...conditions))
      .orderBy(orderByClause);

    return results.map((flight) => {
      const durationMinutes = Math.round(
        (new Date(flight.arrivalTime).getTime() - new Date(flight.departureTime).getTime()) / 60000,
      );

      const basePrice = Number(flight.price);
      const totalPriceValue = adultsCount * basePrice + childrenCount * basePrice * 0.7;
      const totalPrice = totalPriceValue.toFixed(2);

      return {
        ...flight,
        durationMinutes,
        totalPrice,
      };
    });
  }

  async bookFlight(dto: BookFlightDto): Promise<BookingResponseDto> {
    const adultsCount =
      dto.adultsCount !== undefined
        ? dto.adultsCount
        : dto.passengersCount !== undefined
          ? dto.passengersCount
          : 1;
    const childrenCount = dto.childrenCount ?? 0;
    const infantsCount = dto.infantsCount ?? 0;
    const seatsToDeduct = adultsCount + childrenCount;

    return this.db.transaction(async (tx) => {
      const [flight] = await tx
        .select()
        .from(flights)
        .where(eq(flights.id, dto.resourceId))
        .for('update')
        .limit(1);

      if (!flight) {
        throw new NotFoundException('Flight not found');
      }

      if (flight.availableSeats < seatsToDeduct) {
        throw new ConflictException('Not enough available seats');
      }

      await tx
        .update(flights)
        .set({
          availableSeats: sql`${flights.availableSeats} - ${seatsToDeduct}`,
        })
        .where(eq(flights.id, dto.resourceId));

      const [booking] = await tx
        .insert(flightBookings)
        .values({
          flightId: dto.resourceId,
          bookingReference: dto.bookingReference,
          passengersCount: seatsToDeduct,
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
        adultsCount,
        childrenCount,
        infantsCount,
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
        .for('update')
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
