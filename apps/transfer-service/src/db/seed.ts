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
      model: 'Skoda Octavia (Standard)',
      vehicleClass: 'STANDARD' as const,
      vehicleTypeName: 'Седан',
      capacity: 4,
      maxPassengers: 4,
      baggageCapacityInfo: '2 больших чемодана',
      transferRouteType: 'ONE_WAY' as const,
      price: '1500.00',
    },
    {
      model: 'Toyota Camry (Comfort+)',
      vehicleClass: 'STANDARD' as const,
      vehicleTypeName: 'Седан',
      capacity: 4,
      maxPassengers: 4,
      baggageCapacityInfo: '3 чемодана, просторный салон',
      transferRouteType: 'ONE_WAY' as const,
      price: '2200.00',
    },
    {
      model: 'Mercedes-Benz E-Class (Business)',
      vehicleClass: 'STANDARD' as const,
      vehicleTypeName: 'Премиум-седан',
      capacity: 3,
      maxPassengers: 3,
      baggageCapacityInfo: '2 места багажа + ручная кладь',
      transferRouteType: 'ROUND_TRIP' as const,
      price: '3500.00',
    },
    {
      model: 'Mercedes-Benz V-Class (VIP Minivan)',
      vehicleClass: 'MINIVAN' as const,
      vehicleTypeName: 'Минивэн',
      capacity: 6,
      maxPassengers: 6,
      baggageCapacityInfo: 'увеличенный багажник, 6 мест багажа',
      transferRouteType: 'ONE_WAY' as const,
      price: '6000.00',
    },
    {
      model: 'Hyundai H-1 (Family Minivan)',
      vehicleClass: 'MINIVAN' as const,
      vehicleTypeName: 'Минивэн',
      capacity: 7,
      maxPassengers: 7,
      baggageCapacityInfo: 'до 6 чемоданов, детские кресла по запросу',
      transferRouteType: 'ROUND_TRIP' as const,
      price: '4800.00',
    },
  ];

  try {
    for (const vehicle of initialVehicles) {
      await db
        .insert(vehicles)
        .values(vehicle)
        .onConflictDoUpdate({
          target: vehicles.model,
          set: {
            vehicleClass: vehicle.vehicleClass,
            vehicleTypeName: vehicle.vehicleTypeName,
            capacity: vehicle.capacity,
            maxPassengers: vehicle.maxPassengers,
            baggageCapacityInfo: vehicle.baggageCapacityInfo,
            transferRouteType: vehicle.transferRouteType,
            price: vehicle.price,
          },
        });
    }
    console.log('✅ [transfer-service] Seeding completed successfully!');
  } finally {
    await pool.end();
  }
}

seed().catch((err) => {
  console.error('❌ [transfer-service] Seeding failed:', err);
  process.exit(1);
});
