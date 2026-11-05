import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { and, asc, desc, eq, gt, gte, ilike, lte, sql, SQL } from 'drizzle-orm';
import { BookingStatus } from '@t-amada/common';
import { DRIZZLE, DrizzleDB } from './db/database.module';
import { transferBookings, vehicles } from './db/schema';
import { BookingResponseDto } from './dto/booking-response.dto';
import { CancelBookingResponseDto } from './dto/cancel-booking-response.dto';
import { CancelBookingDto } from './dto/cancel-booking.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { SearchTransfersDto } from './dto/search-transfers.dto';
import { TransferResponseDto } from './dto/transfer-response.dto';

export class HealthResponseDto {
  @ApiProperty({ example: 'ok', description: 'Health check status' })
  status: 'ok';

  @ApiProperty({ example: 'transfer-service', description: 'Microservice name' })
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
      service: process.env.SERVICE_NAME || 'transfer-service',
      timestamp: new Date().toISOString(),
    };
  }

  async searchTransfers(query: SearchTransfersDto): Promise<TransferResponseDto[]> {
    const conditions: SQL[] = [gt(vehicles.capacity, 0)];

    if (query.passengersCount !== undefined) {
      conditions.push(gte(vehicles.maxPassengers, query.passengersCount));
    }

    if (query.capacity !== undefined) {
      conditions.push(gte(vehicles.capacity, query.capacity));
    }

    if (query.routeType) {
      conditions.push(eq(vehicles.transferRouteType, query.routeType));
    }

    if (query.model) {
      conditions.push(ilike(vehicles.model, `%${query.model.trim()}%`));
    }

    if (query.minPrice !== undefined) {
      conditions.push(gte(vehicles.price, query.minPrice.toString()));
    }

    if (query.maxPrice !== undefined) {
      conditions.push(lte(vehicles.price, query.maxPrice.toString()));
    }

    let selectQuery = this.db
      .select({
        id: vehicles.id,
        model: vehicles.model,
        vehicleClass: vehicles.vehicleClass,
        vehicleTypeName: vehicles.vehicleTypeName,
        capacity: vehicles.capacity,
        maxPassengers: vehicles.maxPassengers,
        baggageCapacityInfo: vehicles.baggageCapacityInfo,
        transferRouteType: vehicles.transferRouteType,
        price: vehicles.price,
      })
      .from(vehicles)
      .where(and(...conditions));

    if (query.sortBy === 'price_asc') {
      selectQuery = selectQuery.orderBy(asc(vehicles.price)) as typeof selectQuery;
    } else if (query.sortBy === 'price_desc') {
      selectQuery = selectQuery.orderBy(desc(vehicles.price)) as typeof selectQuery;
    }

    return selectQuery;
  }

  async bookTransfer(dto: CreateBookingDto): Promise<BookingResponseDto> {
    return this.db.transaction(async (tx) => {
      const [vehicle] = await tx
        .select()
        .from(vehicles)
        .where(eq(vehicles.id, dto.resourceId))
        .limit(1);

      if (!vehicle) {
        throw new NotFoundException('Vehicle not found');
      }

      if (vehicle.capacity <= 0) {
        throw new ConflictException('No available transfer capacity');
      }

      await tx
        .update(vehicles)
        .set({
          capacity: sql`${vehicles.capacity} - 1`,
        })
        .where(eq(vehicles.id, dto.resourceId));

      const [booking] = await tx
        .insert(transferBookings)
        .values({
          vehicleId: dto.resourceId,
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

  async cancelTransfer(dto: CancelBookingDto): Promise<CancelBookingResponseDto> {
    return this.db.transaction(async (tx) => {
      const [booking] = await tx
        .select()
        .from(transferBookings)
        .where(eq(transferBookings.id, dto.bookingId))
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
        .update(vehicles)
        .set({
          capacity: sql`${vehicles.capacity} + 1`,
        })
        .where(eq(vehicles.id, booking.vehicleId));

      await tx
        .update(transferBookings)
        .set({
          status: BookingStatus.CANCELLED,
        })
        .where(eq(transferBookings.id, booking.id));

      return {
        id: booking.id,
        status: BookingStatus.CANCELLED,
        updatedAt: new Date().toISOString(),
      };
    });
  }
}
