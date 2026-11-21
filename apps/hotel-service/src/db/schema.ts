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
  city: varchar('city', { length: 100 }).notNull().default('Сочи'),
  stars: integer('stars').notNull().default(3),
  locationTag: varchar('location_tag', { length: 255 }),
  imageUrl: varchar('image_url', { length: 500 }),
  hasBreakfast: boolean('has_breakfast').notNull().default(false),
  hasFreeCancellation: boolean('has_free_cancellation').notNull().default(false),
  availableRooms: integer('available_rooms').notNull(),
  pricePerNight: numeric('price_per_night', { precision: 10, scale: 2 }).notNull(),
});

export const hotelRooms = pgTable('hotel_rooms', {
  id: uuid('id').defaultRandom().primaryKey(),
  hotelId: uuid('hotel_id')
    .notNull()
    .references(() => hotels.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  capacityAdults: integer('capacity_adults').notNull().default(2),
  capacityChildren: integer('capacity_children').notNull().default(1),
  hasBreakfast: boolean('has_breakfast').notNull().default(false),
  hasFreeCancellation: boolean('has_free_cancellation').notNull().default(false),
  imageUrl: varchar('image_url', { length: 500 }),
  availableRooms: integer('available_rooms').notNull(),
  pricePerNight: numeric('price_per_night', { precision: 10, scale: 2 }).notNull(),
});

export const hotelBookings = pgTable('hotel_bookings', {
  id: uuid('id').defaultRandom().primaryKey(),
  bookingReference: varchar('booking_reference', { length: 100 }).notNull(),
  hotelId: uuid('hotel_id').references(() => hotels.id, { onDelete: 'cascade' }),
  roomId: uuid('room_id').references(() => hotelRooms.id, { onDelete: 'cascade' }),
  roomsCount: integer('rooms_count').notNull().default(1),
  checkIn: varchar('check_in', { length: 30 }),
  checkOut: varchar('check_out', { length: 30 }),
  status: hotelBookingStatusEnum('status')
    .$type<BookingStatus>()
    .default('PENDING' as BookingStatus)
    .notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const hotelsRelations = relations(hotels, ({ many }) => ({
  rooms: many(hotelRooms),
  bookings: many(hotelBookings),
}));

export const hotelRoomsRelations = relations(hotelRooms, ({ one, many }) => ({
  hotel: one(hotels, {
    fields: [hotelRooms.hotelId],
    references: [hotels.id],
  }),
  bookings: many(hotelBookings),
}));

export const hotelBookingsRelations = relations(hotelBookings, ({ one }) => ({
  hotel: one(hotels, {
    fields: [hotelBookings.hotelId],
    references: [hotels.id],
  }),
  room: one(hotelRooms, {
    fields: [hotelBookings.roomId],
    references: [hotelRooms.id],
  }),
}));

export type Hotel = typeof hotels.$inferSelect;
export type NewHotel = typeof hotels.$inferInsert;
export type HotelRoom = typeof hotelRooms.$inferSelect;
export type NewHotelRoom = typeof hotelRooms.$inferInsert;
export type HotelBooking = typeof hotelBookings.$inferSelect;
export type NewHotelBooking = typeof hotelBookings.$inferInsert;
