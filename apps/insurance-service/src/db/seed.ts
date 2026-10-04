import 'dotenv/config';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';
import { insurancePolicies } from './schema';

async function seed() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not defined in environment variables');
  }

  const pool = new Pool({ connectionString });
  const db = drizzle(pool, { schema });

  console.log('🌱 [insurance-service] Seeding initial insurance policies...');

  const initialPolicies = [
    { title: 'Basic Travel Coverage', price: '1200.00' },
    { title: 'Standard Medical & Baggage Protection', price: '2500.00' },
    { title: 'Premium All-Inclusive Shield', price: '5500.00' },
    { title: 'Extreme Sports & Activity Coverage', price: '4000.00' },
  ];

  try {
    await db.insert(insurancePolicies).values(initialPolicies).onConflictDoNothing();
    console.log('✅ [insurance-service] Seeding completed successfully!');
  } finally {
    await pool.end();
  }
}

seed().catch((err) => {
  console.error('❌ [insurance-service] Seeding failed:', err);
  process.exit(1);
});
