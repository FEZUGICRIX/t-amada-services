import { Inject, Injectable } from '@nestjs/common';
import { and, gte, ilike, lte, SQL } from 'drizzle-orm';
import { DRIZZLE, DrizzleDB } from './db/database.module';
import { hotels } from './db/schema';
import { HotelResponseDto } from './dto/hotel-response.dto';
import { SearchHotelsDto } from './dto/search-hotels.dto';

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
      service: process.env.SERVICE_NAME || 'hotel-service',
      timestamp: new Date().toISOString(),
    };
  }

  async searchHotels(query: SearchHotelsDto): Promise<HotelResponseDto[]> {
    const conditions: SQL[] = [gte(hotels.availableRooms, query.minRooms ?? 1)];

    if (query.name) {
      conditions.push(ilike(hotels.name, `%${query.name}%`));
    }
    if (query.maxPricePerNight !== undefined) {
      conditions.push(lte(hotels.pricePerNight, query.maxPricePerNight.toString()));
    }

    return this.db
      .select({
        id: hotels.id,
        name: hotels.name,
        availableRooms: hotels.availableRooms,
        pricePerNight: hotels.pricePerNight,
      })
      .from(hotels)
      .where(and(...conditions));
  }
}
