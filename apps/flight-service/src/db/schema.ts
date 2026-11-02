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

export const flightBookingStatusEnum = pgEnum('flight_booking_status', [
  'PENDING',
  'PROCESSING',
  'CONFIRMED',
  'FAILED',
  'CANCELLING',
  'CANCELLED',
]);

export const flightClassEnum = pgEnum('flight_class', ['ECONOMY', 'BUSINESS']);

export const flights = pgTable('flights', {
  id: uuid('id').defaultRandom().primaryKey(),
  flightNumber: varchar('flight_number', { length: 50 }).notNull().unique(),
  airlineCode: varchar('airline_code', { length: 10 }).notNull(),
  airlineName: varchar('airline_name', { length: 100 }).notNull(),
  departureCity: varchar('departure_city', { length: 100 }).notNull(),
  arrivalCity: varchar('arrival_city', { length: 100 }).notNull(),
  departureTime: timestamp('departure_time', { withTimezone: true }).notNull(),
  arrivalTime: timestamp('arrival_time', { withTimezone: true }).notNull(),
  hasBaggage: boolean('has_baggage').notNull().default(false),
  baggageWeightKg: integer('baggage_weight_kg'),
  flightClass: flightClassEnum('flight_class').notNull().default('ECONOMY'),
  flightType: varchar('flight_type', { length: 50 }).default('ONE_WAY'),
  availableSeats: integer('available_seats').notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
});

export const flightBookings = pgTable('flight_bookings', {
  id: uuid('id').defaultRandom().primaryKey(),
  bookingReference: varchar('booking_reference', { length: 100 }).notNull(),
  flightId: uuid('flight_id')
    .notNull()
    .references(() => flights.id, { onDelete: 'cascade' }),
  passengersCount: integer('passengers_count').notNull().default(1),
  flightClass: varchar('flight_class', { length: 20 }),
  status: flightBookingStatusEnum('status')
    .$type<BookingStatus>()
    .default('PENDING' as BookingStatus)
    .notNull(),
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
