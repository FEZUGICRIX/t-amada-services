import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, asc, desc, eq, gt, gte, ilike, inArray, lte, or, sql, SQL } from 'drizzle-orm';
import { BookingStatus, HealthResponseDto } from '@t-amada/common';
import { DRIZZLE, DrizzleDB } from './db/database.module';
import { hotelBookings, hotelRooms, hotels } from './db/schema';
import { BookingResponseDto } from './dto/booking-response.dto';
import { CancelBookingResponseDto } from './dto/cancel-booking-response.dto';
import { CancelBookingDto } from './dto/cancel-booking.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { HotelResponseDto } from './dto/hotel-response.dto';
import { HotelRoomResponseDto } from './dto/hotel-room-response.dto';
import { SearchHotelsDto } from './dto/search-hotels.dto';

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
    const conditions: SQL[] = [gt(hotels.availableRooms, 0)];

    if (query.minRooms !== undefined) {
      conditions.push(gte(hotels.availableRooms, query.minRooms));
    }

    if (query.city) {
      const cityPattern = `%${query.city.trim()}%`;
      conditions.push(or(ilike(hotels.locationTag, cityPattern), ilike(hotels.name, cityPattern))!);
    }

    if (query.name) {
      conditions.push(ilike(hotels.name, `%${query.name.trim()}%`));
    }

    if (query.stars && query.stars.length > 0) {
      conditions.push(inArray(hotels.stars, query.stars));
    }

    if (query.hasBreakfast !== undefined) {
      conditions.push(eq(hotels.hasBreakfast, query.hasBreakfast));
    }

    if (query.hasFreeCancellation !== undefined) {
      conditions.push(eq(hotels.hasFreeCancellation, query.hasFreeCancellation));
    }

    const minPrice = query.minPrice;
    if (minPrice !== undefined) {
      conditions.push(gte(hotels.pricePerNight, minPrice.toString()));
    }

    const maxPrice = query.maxPrice ?? query.maxPricePerNight;
    if (maxPrice !== undefined) {
      conditions.push(lte(hotels.pricePerNight, maxPrice.toString()));
    }

    let selectQuery = this.db
      .select({
        id: hotels.id,
        name: hotels.name,
        stars: hotels.stars,
        locationTag: hotels.locationTag,
        imageUrl: hotels.imageUrl,
        hasBreakfast: hotels.hasBreakfast,
        hasFreeCancellation: hotels.hasFreeCancellation,
        availableRooms: hotels.availableRooms,
        pricePerNight: hotels.pricePerNight,
      })
      .from(hotels)
      .where(and(...conditions));

    if (query.sortBy === 'price_asc') {
      selectQuery = selectQuery.orderBy(asc(hotels.pricePerNight)) as typeof selectQuery;
    } else if (query.sortBy === 'price_desc') {
      selectQuery = selectQuery.orderBy(desc(hotels.pricePerNight)) as typeof selectQuery;
    }

    return selectQuery;
  }

  async getHotelRooms(hotelId: string): Promise<HotelRoomResponseDto[]> {
    const [hotel] = await this.db
      .select({ id: hotels.id })
      .from(hotels)
      .where(eq(hotels.id, hotelId))
      .limit(1);

    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }

    return this.db
      .select({
        id: hotelRooms.id,
        hotelId: hotelRooms.hotelId,
        name: hotelRooms.name,
        imageUrl: hotelRooms.imageUrl,
        capacityAdults: hotelRooms.capacityAdults,
        capacityChildren: hotelRooms.capacityChildren,
        hasBreakfast: hotelRooms.hasBreakfast,
        hasFreeCancellation: hotelRooms.hasFreeCancellation,
        availableRooms: hotelRooms.availableRooms,
        pricePerNight: hotelRooms.pricePerNight,
      })
      .from(hotelRooms)
      .where(and(eq(hotelRooms.hotelId, hotelId), gt(hotelRooms.availableRooms, 0)));
  }

  async bookHotel(dto: CreateBookingDto): Promise<BookingResponseDto> {
    const roomsCount = dto.roomsCount ?? 1;

    return this.db.transaction(async (tx) => {
      const [room] = await tx
        .select()
        .from(hotelRooms)
        .where(eq(hotelRooms.id, dto.resourceId))
        .limit(1);

      if (!room) {
        throw new NotFoundException('Hotel room not found');
      }

      if (room.availableRooms < roomsCount) {
        throw new ConflictException('Not enough available rooms');
      }

      await tx
        .update(hotelRooms)
        .set({
          availableRooms: sql`${hotelRooms.availableRooms} - ${roomsCount}`,
        })
        .where(eq(hotelRooms.id, dto.resourceId));

      const [booking] = await tx
        .insert(hotelBookings)
        .values({
          hotelId: room.hotelId,
          roomId: room.id,
          roomsCount,
          bookingReference: dto.bookingReference,
          status: BookingStatus.CONFIRMED,
        })
        .returning();

      return {
        id: booking.id,
        bookingReference: booking.bookingReference,
        roomId: booking.roomId!,
        roomsCount: booking.roomsCount,
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

      const restoreCount = booking.roomsCount ?? 1;

      if (booking.roomId) {
        await tx
          .update(hotelRooms)
          .set({
            availableRooms: sql`${hotelRooms.availableRooms} + ${restoreCount}`,
          })
          .where(eq(hotelRooms.id, booking.roomId));
      } else if (booking.hotelId) {
        // Legacy fallback: restore to hotel-level counter
        await tx
          .update(hotels)
          .set({
            availableRooms: sql`${hotels.availableRooms} + ${restoreCount}`,
          })
          .where(eq(hotels.id, booking.hotelId));
      }

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
