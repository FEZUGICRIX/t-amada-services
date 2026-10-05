import { Inject, Injectable } from '@nestjs/common';
import { and, gte, ilike, lte, SQL } from 'drizzle-orm';
import { DRIZZLE, DrizzleDB } from './db/database.module';
import { vehicles } from './db/schema';
import { SearchTransfersDto } from './dto/search-transfers.dto';
import { TransferResponseDto } from './dto/transfer-response.dto';

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
      service: process.env.SERVICE_NAME || 'transfer-service',
      timestamp: new Date().toISOString(),
    };
  }

  async searchTransfers(query: SearchTransfersDto): Promise<TransferResponseDto[]> {
    const conditions: SQL[] = [];

    if (query.capacity !== undefined) {
      conditions.push(gte(vehicles.capacity, query.capacity));
    }
    if (query.model) {
      conditions.push(ilike(vehicles.model, `%${query.model}%`));
    }
    if (query.maxPrice !== undefined) {
      conditions.push(lte(vehicles.price, query.maxPrice.toString()));
    }

    const selectQuery = this.db
      .select({
        id: vehicles.id,
        model: vehicles.model,
        capacity: vehicles.capacity,
        price: vehicles.price,
      })
      .from(vehicles);

    return conditions.length > 0 ? selectQuery.where(and(...conditions)) : selectQuery;
  }
}
