import { pgTable, uuid, varchar, integer, numeric, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const flightBookingStatusEnum = pgEnum('flight_booking_status', [
  'PENDING',
  'CONFIRMED',
  'CANCELLED',
]);

export const flights = pgTable('flights', {
  id: uuid('id').defaultRandom().primaryKey(),
  flightNumber: varchar('flight_number', { length: 50 }).notNull().unique(),
  availableSeats: integer('available_seats').notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
});

export const flightBookings = pgTable('flight_bookings', {
  id: uuid('id').defaultRandom().primaryKey(),
  bookingReference: varchar('booking_reference', { length: 100 }).notNull(),
  flightId: uuid('flight_id')
    .notNull()
    .references(() => flights.id, { onDelete: 'cascade' }),
  status: flightBookingStatusEnum('status').default('PENDING').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const flightsRelations = relations(flights, ({ many }) => ({
  bookings: many(flightBookings),
}));

export const flightBookingsRelations = relations(flightBookings, ({ one }) => ({
  flight: one(flights, {
    fields: [flightBookings.flightId],
    references: [flights.id],
  }),
}));

export type Flight = typeof flights.$inferSelect;
export type NewFlight = typeof flights.$inferInsert;
export type FlightBooking = typeof flightBookings.$inferSelect;
export type NewFlightBooking = typeof flightBookings.$inferInsert;
