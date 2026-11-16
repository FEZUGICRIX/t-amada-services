import 'dotenv/config';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import * as schema from './schema';
import { hotels, hotelRooms } from './schema';

interface RoomSeed {
  name: string;
  imageUrl: string;
  capacityAdults: number;
  capacityChildren: number;
  hasBreakfast: boolean;
  hasFreeCancellation: boolean;
  availableRooms: number;
  pricePerNight: string;
}

const roomTemplates: Record<string, RoomSeed[]> = {
  'Radisson Blu Resort & Congress Centre': [
    {
      name: 'Стандарт двухместный',
      imageUrl: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32',
      capacityAdults: 2,
      capacityChildren: 1,
      hasBreakfast: false,
      hasFreeCancellation: false,
      availableRooms: 20,
      pricePerNight: '8500.00',
    },
    {
      name: 'Стандарт с завтраком',
      imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427',
      capacityAdults: 2,
      capacityChildren: 1,
      hasBreakfast: true,
      hasFreeCancellation: false,
      availableRooms: 15,
      pricePerNight: '9500.00',
    },
    {
      name: 'Люкс семейный',
      imageUrl: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461',
      capacityAdults: 2,
      capacityChildren: 2,
      hasBreakfast: true,
      hasFreeCancellation: true,
      availableRooms: 15,
      pricePerNight: '14500.00',
    },
  ],
  'Grand Hotel Polyana': [
    {
      name: 'Стандарт двухместный',
      imageUrl: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304',
      capacityAdults: 2,
      capacityChildren: 0,
      hasBreakfast: false,
      hasFreeCancellation: false,
      availableRooms: 15,
      pricePerNight: '12000.00',
    },
    {
      name: 'Улучшенный с завтраком',
      imageUrl: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39',
      capacityAdults: 2,
      capacityChildren: 1,
      hasBreakfast: true,
      hasFreeCancellation: false,
      availableRooms: 10,
      pricePerNight: '14000.00',
    },
    {
      name: 'Люкс семейный',
      imageUrl: 'https://images.unsplash.com/photo-1591088398332-8a7791972843',
      capacityAdults: 2,
      capacityChildren: 2,
      hasBreakfast: true,
      hasFreeCancellation: true,
      availableRooms: 10,
      pricePerNight: '22000.00',
    },
  ],
  'Cosmos Moscow Hotel': [
    {
      name: 'Эконом одноместный',
      imageUrl: 'https://images.unsplash.com/photo-1598928636135-d146006ff4be',
      capacityAdults: 1,
      capacityChildren: 0,
      hasBreakfast: false,
      hasFreeCancellation: true,
      availableRooms: 50,
      pricePerNight: '3500.00',
    },
    {
      name: 'Стандарт двухместный',
      imageUrl: 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061',
      capacityAdults: 2,
      capacityChildren: 1,
      hasBreakfast: false,
      hasFreeCancellation: true,
      availableRooms: 40,
      pricePerNight: '4500.00',
    },
    {
      name: 'Стандарт с завтраком',
      imageUrl: 'https://images.unsplash.com/photo-1611048267451-e6ed903d4a38',
      capacityAdults: 2,
      capacityChildren: 1,
      hasBreakfast: true,
      hasFreeCancellation: true,
      availableRooms: 30,
      pricePerNight: '5800.00',
    },
  ],
  'Marriott Krasnaya Polyana': [
    {
      name: 'Стандарт двухместный',
      imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b',
      capacityAdults: 2,
      capacityChildren: 1,
      hasBreakfast: true,
      hasFreeCancellation: false,
      availableRooms: 10,
      pricePerNight: '16000.00',
    },
    {
      name: 'Люкс семейный',
      imageUrl: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6',
      capacityAdults: 2,
      capacityChildren: 2,
      hasBreakfast: true,
      hasFreeCancellation: true,
      availableRooms: 8,
      pricePerNight: '25000.00',
    },
    {
      name: 'Президентский люкс',
      imageUrl: 'https://images.unsplash.com/photo-1587985064135-0571b93b16a7',
      capacityAdults: 2,
      capacityChildren: 2,
      hasBreakfast: true,
      hasFreeCancellation: true,
      availableRooms: 7,
      pricePerNight: '45000.00',
    },
  ],
  'Bridge Resort Sochi': [
    {
      name: 'Стандарт двухместный',
      imageUrl: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a',
      capacityAdults: 2,
      capacityChildren: 1,
      hasBreakfast: false,
      hasFreeCancellation: true,
      availableRooms: 20,
      pricePerNight: '6500.00',
    },
    {
      name: 'Стандарт с завтраком',
      imageUrl: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7',
      capacityAdults: 2,
      capacityChildren: 1,
      hasBreakfast: true,
      hasFreeCancellation: true,
      availableRooms: 10,
      pricePerNight: '7800.00',
    },
    {
      name: 'Люкс семейный',
      imageUrl: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f',
      capacityAdults: 2,
      capacityChildren: 2,
      hasBreakfast: true,
      hasFreeCancellation: true,
      availableRooms: 10,
      pricePerNight: '12000.00',
    },
  ],
};

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
    // Upsert hotels
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
    console.log('✅ [hotel-service] Hotels upserted');

    // Seed room types for each hotel
    const allHotels = await db.select().from(hotels);

    for (const hotel of allHotels) {
      const templates = roomTemplates[hotel.name];
      if (!templates) continue;

      for (const tmpl of templates) {
        // Check if room already exists by hotel + name combination
        const [existing] = await db
          .select({ id: hotelRooms.id })
          .from(hotelRooms)
          .where(
            eq(hotelRooms.hotelId, hotel.id),
          )
          .limit(1);

        // If hotel already has rooms — delete and re-create for idempotency
        if (existing) {
          await db.delete(hotelRooms).where(eq(hotelRooms.hotelId, hotel.id));
        }
      }

      // Insert all rooms for this hotel
      for (const tmpl of templates) {
        await db.insert(hotelRooms).values({
          hotelId: hotel.id,
          ...tmpl,
        });
      }
    }

    console.log('✅ [hotel-service] Hotel rooms seeded');
    console.log('✅ [hotel-service] Seeding completed successfully!');
  } finally {
    await pool.end();
  }
}

seed().catch((err) => {
  console.error('❌ [hotel-service] Seeding failed:', err);
  process.exit(1);
});
