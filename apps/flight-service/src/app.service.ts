import { Inject, Injectable } from '@nestjs/common';
import { and, gte, ilike, lte, SQL } from 'drizzle-orm';
import { DRIZZLE, DrizzleDB } from './db/database.module';
import { flights } from './db/schema';
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
}
