import { pgTable, uuid, varchar, integer, numeric, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const transferBookingStatusEnum = pgEnum('transfer_booking_status', [
  'PENDING',
  'CONFIRMED',
  'CANCELLED',
]);

export const vehicles = pgTable('vehicles', {
  id: uuid('id').defaultRandom().primaryKey(),
  model: varchar('model', { length: 255 }).notNull().unique(),
  capacity: integer('capacity').notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
});

export const transferBookings = pgTable('transfer_bookings', {
  id: uuid('id').defaultRandom().primaryKey(),
  bookingReference: varchar('booking_reference', { length: 100 }).notNull(),
  vehicleId: uuid('vehicle_id')
    .notNull()
    .references(() => vehicles.id, { onDelete: 'cascade' }),
  status: transferBookingStatusEnum('status').default('PENDING').notNull(),
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
