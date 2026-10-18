import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, eq, ilike, lte, SQL } from 'drizzle-orm';
import { BookingStatus } from '@t-amada/common';
import { DRIZZLE, DrizzleDB } from './db/database.module';
import { insuranceBookings, insurancePolicies } from './db/schema';
import { BookingResponseDto } from './dto/booking-response.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
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

  async bookInsurance(dto: CreateBookingDto): Promise<BookingResponseDto> {
    return this.db.transaction(async (tx) => {
      const [policy] = await tx
        .select()
        .from(insurancePolicies)
        .where(eq(insurancePolicies.id, dto.resourceId))
        .limit(1);

      if (!policy) {
        throw new NotFoundException('Insurance policy not found');
      }

      const [booking] = await tx
        .insert(insuranceBookings)
        .values({
          policyId: dto.resourceId,
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
