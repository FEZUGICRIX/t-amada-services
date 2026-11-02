import {
  pgTable,
  uuid,
  varchar,
  integer,
  numeric,
  timestamp,
  pgEnum,
  boolean,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import type { BookingStatus } from '@t-amada/common';

export const hotelBookingStatusEnum = pgEnum('hotel_booking_status', [
  'PENDING',
  'PROCESSING',
  'CONFIRMED',
  'FAILED',
  'CANCELLING',
  'CANCELLED',
]);

export const hotels = pgTable('hotels', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  stars: integer('stars').notNull().default(3),
  locationTag: varchar('location_tag', { length: 255 }),
  imageUrl: varchar('image_url', { length: 500 }),
  hasBreakfast: boolean('has_breakfast').notNull().default(false),
  hasFreeCancellation: boolean('has_free_cancellation').notNull().default(false),
  availableRooms: integer('available_rooms').notNull(),
  pricePerNight: numeric('price_per_night', { precision: 10, scale: 2 }).notNull(),
});

export const hotelBookings = pgTable('hotel_bookings', {
  id: uuid('id').defaultRandom().primaryKey(),
  bookingReference: varchar('booking_reference', { length: 100 }).notNull(),
  hotelId: uuid('hotel_id')
    .notNull()
    .references(() => hotels.id, { onDelete: 'cascade' }),
  status: hotelBookingStatusEnum('status')
    .$type<BookingStatus>()
    .default('PENDING' as BookingStatus)
    .notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const hotelsRelations = relations(hotels, ({ many }) => ({
  bookings: many(hotelBookings),
}));

export const hotelBookingsRelations = relations(hotelBookings, ({ one }) => ({
  hotel: one(hotels, {
    fields: [hotelBookings.hotelId],
    references: [hotels.id],
  }),
}));

export type Hotel = typeof hotels.$inferSelect;
export type NewHotel = typeof hotels.$inferInsert;
export type HotelBooking = typeof hotelBookings.$inferSelect;
export type NewHotelBooking = typeof hotelBookings.$inferInsert;
