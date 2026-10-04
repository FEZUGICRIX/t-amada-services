import { pgTable, uuid, varchar, numeric, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const insuranceBookingStatusEnum = pgEnum('insurance_booking_status', [
  'PENDING',
  'CONFIRMED',
  'CANCELLED',
]);

export const insurancePolicies = pgTable('insurance_policies', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
});

export const insuranceBookings = pgTable('insurance_bookings', {
  id: uuid('id').defaultRandom().primaryKey(),
  bookingReference: varchar('booking_reference', { length: 100 }).notNull(),
  policyId: uuid('policy_id')
    .notNull()
    .references(() => insurancePolicies.id, { onDelete: 'cascade' }),
  status: insuranceBookingStatusEnum('status').default('PENDING').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const insurancePoliciesRelations = relations(insurancePolicies, ({ many }) => ({
  bookings: many(insuranceBookings),
}));

export const insuranceBookingsRelations = relations(insuranceBookings, ({ one }) => ({
  policy: one(insurancePolicies, {
    fields: [insuranceBookings.policyId],
    references: [insurancePolicies.id],
  }),
}));

export type InsurancePolicy = typeof insurancePolicies.$inferSelect;
export type NewInsurancePolicy = typeof insurancePolicies.$inferInsert;
export type InsuranceBooking = typeof insuranceBookings.$inferSelect;
export type NewInsuranceBooking = typeof insuranceBookings.$inferInsert;
