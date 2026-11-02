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
      stars: 5,
      locationTag: 'Первая линия, 100 м до моря',
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
      hasBreakfast: true,
      hasFreeCancellation: true,
      availableRooms: 50,
      pricePerNight: '9500.00',
    },
    {
      name: 'Grand Hotel Polyana',
      stars: 5,
      locationTag: 'Красная Поляна, у подъемников',
      imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd',
      hasBreakfast: true,
      hasFreeCancellation: false,
      availableRooms: 35,
      pricePerNight: '14000.00',
    },
    {
      name: 'Cosmos Moscow Hotel',
      stars: 3,
      locationTag: 'ВДНХ, 200 м до метро',
      imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4',
      hasBreakfast: false,
      hasFreeCancellation: true,
      availableRooms: 120,
      pricePerNight: '4500.00',
    },
    {
      name: 'Marriott Krasnaya Polyana',
      stars: 5,
      locationTag: 'Центр курорта Горки Город',
      imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb',
      hasBreakfast: true,
      hasFreeCancellation: true,
      availableRooms: 25,
      pricePerNight: '18000.00',
    },
    {
      name: 'Bridge Resort Sochi',
      stars: 4,
      locationTag: 'Имеретинская низменность, 300 м до моря',
      imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d',
      hasBreakfast: true,
      hasFreeCancellation: true,
      availableRooms: 40,
      pricePerNight: '7800.00',
    },
  ];

  try {
    // Truncate or onConflictDoUpdate to ensure fresh attributes for existing hotels
    for (const hotel of initialHotels) {
      await db
        .insert(hotels)
        .values(hotel)
        .onConflictDoUpdate({
          target: hotels.name,
          set: {
            stars: hotel.stars,
            locationTag: hotel.locationTag,
            imageUrl: hotel.imageUrl,
            hasBreakfast: hotel.hasBreakfast,
            hasFreeCancellation: hotel.hasFreeCancellation,
            availableRooms: hotel.availableRooms,
            pricePerNight: hotel.pricePerNight,
          },
        });
    }
    console.log('✅ [hotel-service] Seeding completed successfully!');
  } finally {
    await pool.end();
  }
}

seed().catch((err) => {
  console.error('❌ [hotel-service] Seeding failed:', err);
  process.exit(1);
});
