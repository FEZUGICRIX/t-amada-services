import 'dotenv/config';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';
import { flights } from './schema';

async function seed() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not defined in environment variables');
  }

  const pool = new Pool({ connectionString });
  const db = drizzle(pool, { schema });

  console.log('🌱 [flight-service] Seeding initial flights data...');

  const initialFlights = [
    { flightNumber: 'SU-1120', availableSeats: 150, price: '8500.00' },
    { flightNumber: 'S7-2044', availableSeats: 80, price: '7200.00' },
    { flightNumber: 'DP-402', availableSeats: 45, price: '4900.00' },
    { flightNumber: 'UT-365', availableSeats: 120, price: '6300.00' },
  ];

  try {
    await db.insert(flights).values(initialFlights).onConflictDoNothing();
    console.log('✅ [flight-service] Seeding completed successfully!');
  } finally {
    await pool.end();
  }
}

seed().catch((err) => {
  console.error('❌ [flight-service] Seeding failed:', err);
  process.exit(1);
});
