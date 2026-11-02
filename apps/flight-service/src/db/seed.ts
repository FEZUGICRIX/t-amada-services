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
    {
      flightNumber: 'SU-1120',
      airlineCode: 'SU',
      airlineName: 'Аэрофлот',
      departureCity: 'Москва',
      arrivalCity: 'Сочи',
      departureTime: new Date('2026-11-10T08:30:00Z'),
      arrivalTime: new Date('2026-11-10T12:30:00Z'),
      hasBaggage: true,
      baggageWeightKg: 23,
      flightClass: 'ECONOMY' as const,
      flightType: 'OUTBOUND',
      availableSeats: 150,
      price: '8500.00',
    },
    {
      flightNumber: 'SU-1121',
      airlineCode: 'SU',
      airlineName: 'Аэрофлот',
      departureCity: 'Сочи',
      arrivalCity: 'Москва',
      departureTime: new Date('2026-11-17T14:00:00Z'),
      arrivalTime: new Date('2026-11-17T18:00:00Z'),
      hasBaggage: true,
      baggageWeightKg: 23,
      flightClass: 'ECONOMY' as const,
      flightType: 'RETURN',
      availableSeats: 120,
      price: '8900.00',
    },
    {
      flightNumber: 'S7-2044',
      airlineCode: 'S7',
      airlineName: 'S7 Airlines',
      departureCity: 'Москва',
      arrivalCity: 'Санкт-Петербург',
      departureTime: new Date('2026-11-12T10:15:00Z'),
      arrivalTime: new Date('2026-11-12T11:45:00Z'),
      hasBaggage: true,
      baggageWeightKg: 30,
      flightClass: 'BUSINESS' as const,
      flightType: 'ONE_WAY',
      availableSeats: 12,
      price: '18500.00',
    },
    {
      flightNumber: 'DP-402',
      airlineCode: 'DP',
      airlineName: 'Победа',
      departureCity: 'Москва',
      arrivalCity: 'Калининград',
      departureTime: new Date('2026-11-15T06:00:00Z'),
      arrivalTime: new Date('2026-11-15T08:40:00Z'),
      hasBaggage: false,
      baggageWeightKg: null,
      flightClass: 'ECONOMY' as const,
      flightType: 'ONE_WAY',
      availableSeats: 45,
      price: '4900.00',
    },
    {
      flightNumber: 'UT-365',
      airlineCode: 'UT',
      airlineName: 'ЮТэйр',
      departureCity: 'Москва',
      arrivalCity: 'Тюмень',
      departureTime: new Date('2026-11-18T23:50:00Z'),
      arrivalTime: new Date('2026-11-19T04:45:00Z'),
      hasBaggage: true,
      baggageWeightKg: 20,
      flightClass: 'ECONOMY' as const,
      flightType: 'ONE_WAY',
      availableSeats: 80,
      price: '6300.00',
    },
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
