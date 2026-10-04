import { pgTable, uuid, varchar, integer, numeric, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const hotelBookingStatusEnum = pgEnum('hotel_booking_status', [
  'PENDING',
  'CONFIRMED',
  'CANCELLED',
]);

export const hotels = pgTable('hotels', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  availableRooms: integer('available_rooms').notNull(),
  pricePerNight: numeric('price_per_night', { precision: 10, scale: 2 }).notNull(),
});

export const hotelBookings = pgTable('hotel_bookings', {
  id: uuid('id').defaultRandom().primaryKey(),
  bookingReference: varchar('booking_reference', { length: 100 }).notNull(),
  hotelId: uuid('hotel_id')
    .notNull()
    .references(() => hotels.id, { onDelete: 'cascade' }),
  status: hotelBookingStatusEnum('status').default('PENDING').notNull(),
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
