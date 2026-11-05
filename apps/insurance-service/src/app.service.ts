import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { and, asc, desc, eq, gte, ilike, lte, SQL } from 'drizzle-orm';
import { BookingStatus } from '@t-amada/common';
import { DRIZZLE, DrizzleDB } from './db/database.module';
import { insuranceBookings, insurancePolicies } from './db/schema';
import { BookingResponseDto } from './dto/booking-response.dto';
import { CancelBookingResponseDto } from './dto/cancel-booking-response.dto';
import { CancelBookingDto } from './dto/cancel-booking.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { InsuranceResponseDto } from './dto/insurance-response.dto';
import { SearchInsurancesDto } from './dto/search-insurances.dto';

export class HealthResponseDto {
  @ApiProperty({ example: 'ok', description: 'Health check status' })
  status: 'ok';

  @ApiProperty({ example: 'insurance-service', description: 'Microservice name' })
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
      service: process.env.SERVICE_NAME || 'insurance-service',
      timestamp: new Date().toISOString(),
    };
  }

  async searchInsurances(query: SearchInsurancesDto): Promise<InsuranceResponseDto[]> {
    const conditions: SQL[] = [];

    if (query.planType) {
      conditions.push(eq(insurancePolicies.planType, query.planType));
    }

    if (query.title) {
      conditions.push(ilike(insurancePolicies.title, `%${query.title.trim()}%`));
    }

    if (query.minPrice !== undefined) {
      conditions.push(gte(insurancePolicies.price, query.minPrice.toString()));
    }

    if (query.maxPrice !== undefined) {
      conditions.push(lte(insurancePolicies.price, query.maxPrice.toString()));
    }

    let selectQuery = this.db
      .select({
        id: insurancePolicies.id,
        title: insurancePolicies.title,
        planType: insurancePolicies.planType,
        coverageAmount: insurancePolicies.coverageAmount,
        coveredRisks: insurancePolicies.coveredRisks,
        exclusions: insurancePolicies.exclusions,
        price: insurancePolicies.price,
      })
      .from(insurancePolicies);

    if (conditions.length > 0) {
      selectQuery = selectQuery.where(and(...conditions)) as typeof selectQuery;
    }

    if (query.sortBy === 'price_asc') {
      selectQuery = selectQuery.orderBy(asc(insurancePolicies.price)) as typeof selectQuery;
    } else if (query.sortBy === 'price_desc') {
      selectQuery = selectQuery.orderBy(desc(insurancePolicies.price)) as typeof selectQuery;
    }

    const policies = await selectQuery;

    const passengersCount = query.passengersCount;

    return policies.map((policy) => {
      const basePrice = policy.price;
      const numericPrice = parseFloat(basePrice);

      if (passengersCount !== undefined && passengersCount > 0) {
        const total = (numericPrice * passengersCount).toFixed(2);
        return {
          ...policy,
          basePrice,
          totalPrice: total,
          passengersCount,
        };
      }

      return {
        ...policy,
        basePrice,
        totalPrice: basePrice,
      };
    });
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

  async cancelInsurance(dto: CancelBookingDto): Promise<CancelBookingResponseDto> {
    return this.db.transaction(async (tx) => {
      const [booking] = await tx
        .select()
        .from(insuranceBookings)
        .where(eq(insuranceBookings.id, dto.bookingId))
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

      await tx
        .update(insuranceBookings)
        .set({
          status: BookingStatus.CANCELLED,
        })
        .where(eq(insuranceBookings.id, booking.id));

      return {
        id: booking.id,
        status: BookingStatus.CANCELLED,
        updatedAt: new Date().toISOString(),
      };
    });
  }
}
