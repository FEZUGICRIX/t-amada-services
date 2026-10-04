import 'dotenv/config';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';
import { hotels } from './schema';

async function seed() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not defined in environment variables');
  }

  const pool = new Pool({ connectionString });
  const db = drizzle(pool, { schema });

  console.log('🌱 [hotel-service] Seeding initial hotels data...');

  const initialHotels = [
    {
      name: 'Radisson Blu Resort & Congress Centre',
      availableRooms: 50,
      pricePerNight: '9500.00',
    },
    {
      name: 'Grand Hotel Polyana',
      availableRooms: 35,
      pricePerNight: '14000.00',
    },
    {
      name: 'Cosmos Moscow Hotel',
      availableRooms: 120,
      pricePerNight: '4500.00',
    },
    {
      name: 'Marriott Krasnaya Polyana',
      availableRooms: 25,
      pricePerNight: '18000.00',
    },
  ];

  try {
    await db.insert(hotels).values(initialHotels).onConflictDoNothing();
    console.log('✅ [hotel-service] Seeding completed successfully!');
  } finally {
    await pool.end();
  }
}

seed().catch((err) => {
  console.error('❌ [hotel-service] Seeding failed:', err);
  process.exit(1);
});
