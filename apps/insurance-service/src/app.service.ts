import { Inject, Injectable } from '@nestjs/common';
import { and, ilike, lte, SQL } from 'drizzle-orm';
import { DRIZZLE, DrizzleDB } from './db/database.module';
import { insurancePolicies } from './db/schema';
import { InsuranceResponseDto } from './dto/insurance-response.dto';
import { SearchInsurancesDto } from './dto/search-insurances.dto';

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
      service: process.env.SERVICE_NAME || 'insurance-service',
      timestamp: new Date().toISOString(),
    };
  }

  async searchInsurances(query: SearchInsurancesDto): Promise<InsuranceResponseDto[]> {
    const conditions: SQL[] = [];

    if (query.title) {
      conditions.push(ilike(insurancePolicies.title, `%${query.title}%`));
    }
    if (query.maxPrice !== undefined) {
      conditions.push(lte(insurancePolicies.price, query.maxPrice.toString()));
    }

    const selectQuery = this.db
      .select({
        id: insurancePolicies.id,
        title: insurancePolicies.title,
        price: insurancePolicies.price,
      })
      .from(insurancePolicies);

    return conditions.length > 0 ? selectQuery.where(and(...conditions)) : selectQuery;
  }
}
