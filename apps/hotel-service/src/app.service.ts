import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, eq, gte, ilike, lte, sql, SQL } from 'drizzle-orm';
import { BookingStatus } from '@t-amada/common';
import { DRIZZLE, DrizzleDB } from './db/database.module';
import { hotelBookings, hotels } from './db/schema';
import { BookingResponseDto } from './dto/booking-response.dto';
import { CancelBookingResponseDto } from './dto/cancel-booking-response.dto';
import { CancelBookingDto } from './dto/cancel-booking.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
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

  async bookHotel(dto: CreateBookingDto): Promise<BookingResponseDto> {
    return this.db.transaction(async (tx) => {
      const [hotel] = await tx.select().from(hotels).where(eq(hotels.id, dto.resourceId)).limit(1);

      if (!hotel) {
        throw new NotFoundException('Hotel not found');
      }

      if (hotel.availableRooms <= 0) {
        throw new ConflictException('Hotel room is already occupied or unavailable');
      }

      await tx
        .update(hotels)
        .set({
          availableRooms: sql`${hotels.availableRooms} - 1`,
        })
        .where(eq(hotels.id, dto.resourceId));

      const [booking] = await tx
        .insert(hotelBookings)
        .values({
          hotelId: dto.resourceId,
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

  async cancelHotel(dto: CancelBookingDto): Promise<CancelBookingResponseDto> {
    return this.db.transaction(async (tx) => {
      const [booking] = await tx
        .select()
        .from(hotelBookings)
        .where(eq(hotelBookings.id, dto.bookingId))
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
        .update(hotels)
        .set({
          availableRooms: sql`${hotels.availableRooms} + 1`,
        })
        .where(eq(hotels.id, booking.hotelId));

      await tx
        .update(hotelBookings)
        .set({
          status: BookingStatus.CANCELLED,
        })
        .where(eq(hotelBookings.id, booking.id));

      return {
        id: booking.id,
        status: BookingStatus.CANCELLED,
        updatedAt: new Date().toISOString(),
      };
    });
  }
}
