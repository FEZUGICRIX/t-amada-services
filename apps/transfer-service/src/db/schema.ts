import { pgTable, uuid, varchar, integer, numeric, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import type { BookingStatus } from '@t-amada/common';

export const transferBookingStatusEnum = pgEnum('transfer_booking_status', [
  'PENDING',
  'PROCESSING',
  'CONFIRMED',
  'FAILED',
  'CANCELLING',
  'CANCELLED',
]);

export const vehicleClassEnum = pgEnum('vehicle_class', ['STANDARD', 'MINIVAN']);

export const transferRouteTypeEnum = pgEnum('transfer_route_type', ['ONE_WAY', 'ROUND_TRIP']);

export const vehicles = pgTable('vehicles', {
  id: uuid('id').defaultRandom().primaryKey(),
  model: varchar('model', { length: 255 }).notNull().unique(),
  vehicleClass: vehicleClassEnum('vehicle_class').notNull().default('STANDARD'),
  vehicleTypeName: varchar('vehicle_type_name', { length: 50 }).notNull(),
  capacity: integer('capacity').notNull(),
  maxPassengers: integer('max_passengers').notNull(),
  baggageCapacityInfo: varchar('baggage_capacity_info', { length: 255 }),
  transferRouteType: transferRouteTypeEnum('transfer_route_type').notNull().default('ONE_WAY'),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
});

export const transferBookings = pgTable('transfer_bookings', {
  id: uuid('id').defaultRandom().primaryKey(),
  bookingReference: varchar('booking_reference', { length: 100 }).notNull(),
  vehicleId: uuid('vehicle_id')
    .notNull()
    .references(() => vehicles.id, { onDelete: 'cascade' }),
  status: transferBookingStatusEnum('status')
    .$type<BookingStatus>()
    .default('PENDING' as BookingStatus)
    .notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const vehiclesRelations = relations(vehicles, ({ many }) => ({
  bookings: many(transferBookings),
}));

export const transferBookingsRelations = relations(transferBookings, ({ one }) => ({
  vehicle: one(vehicles, {
    fields: [transferBookings.vehicleId],
    references: [vehicles.id],
  }),
}));

export type Vehicle = typeof vehicles.$inferSelect;
export type NewVehicle = typeof vehicles.$inferInsert;
export type TransferBooking = typeof transferBookings.$inferSelect;
export type NewTransferBooking = typeof transferBookings.$inferInsert;
