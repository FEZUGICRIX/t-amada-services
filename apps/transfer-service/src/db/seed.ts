import 'dotenv/config';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';
import { vehicles } from './schema';

async function seed() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not defined in environment variables');
  }

  const pool = new Pool({ connectionString });
  const db = drizzle(pool, { schema });

  console.log('🌱 [transfer-service] Seeding initial vehicles data...');

  const initialVehicles = [
    {
      model: 'Mercedes-Benz E-Class (Business)',
      capacity: 3,
      price: '3500.00',
    },
    { model: 'Toyota Camry (Comfort+)', capacity: 4, price: '2200.00' },
    {
      model: 'Mercedes-Benz V-Class (VIP Minivan)',
      capacity: 7,
      price: '6000.00',
    },
    { model: 'Skoda Octavia (Standard)', capacity: 4, price: '1500.00' },
  ];

  try {
    await db.insert(vehicles).values(initialVehicles).onConflictDoNothing();
    console.log('✅ [transfer-service] Seeding completed successfully!');
  } finally {
    await pool.end();
  }
}

seed().catch((err) => {
  console.error('❌ [transfer-service] Seeding failed:', err);
  process.exit(1);
});
