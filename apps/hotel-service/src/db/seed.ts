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
  tags: string[];
  availableRooms: number;
  pricePerNight: string;
}

interface HotelSeed {
  name: string;
  description: string;
  address: string;
  city: string;
  stars: number;
  locationTag: string;
  imageUrl: string;
  tags: string[];
  hasBreakfast: boolean;
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
      tags: ['Wi-Fi', 'Кондиционер', 'Двуспальная кровать', 'Душ'],
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
      tags: ['Завтрак "шведский стол"', 'Wi-Fi', 'Кондиционер', 'Рабочая зона'],
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
      tags: ['Вид на море', 'Балкон', 'Две комнаты', 'Халаты и тапочки', 'Кофемашина'],
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
      tags: ['Вид на горы', 'Wi-Fi', 'Мини-бар', 'Сейф'],
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
      tags: ['Завтрак включен', 'Вид на горы', 'Балкон', 'Wi-Fi'],
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
      tags: ['Панорамный вид', 'Две спальни', 'Гостиная', 'Камин', 'Джакузи'],
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
      tags: ['Wi-Fi', 'Телевизор', 'Односпальная кровать'],
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
      tags: ['Wi-Fi', 'Кондиционер', 'Две раздельные кровати'],
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
      tags: ['Завтрак "шведский стол"', 'Wi-Fi', 'Вид на ВДНХ'],
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
      tags: ['Вид на горы', 'King size кровать', 'Мраморная ванная', 'Wi-Fi'],
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
      tags: ['Балкон с видом на горы', 'Гостиная зона', 'Кофемашина', 'Халаты'],
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
      tags: ['Панорамная терраса', 'Сауна', 'Персональный батлер', 'Джакузи'],
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
      tags: ['Wi-Fi', 'Кондиционер', 'Балкон', 'Двуспальная кровать'],
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
      tags: ['Завтрак включен', 'Балкон', 'Wi-Fi', 'Чайная станция'],
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
      tags: ['Две комнаты', 'Вид на море', 'Халаты', 'Детская кроватка по запросу'],
      availableRooms: 10,
      pricePerNight: '12000.00',
    },
  ],
  'Grand Hotel Europe': [
    {
      name: 'Стандарт двухместный',
      imageUrl: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32',
      capacityAdults: 2,
      capacityChildren: 1,
      hasBreakfast: false,
      hasFreeCancellation: true,
      tags: ['Исторический интерьер', 'Wi-Fi', 'Королевская кровать', 'Мини-бар'],
      availableRooms: 15,
      pricePerNight: '13000.00',
    },
    {
      name: 'Делюкс с завтраком',
      imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427',
      capacityAdults: 2,
      capacityChildren: 1,
      hasBreakfast: true,
      hasFreeCancellation: true,
      tags: ['Завтрак в ресторане', 'Вид на площадь Искусств', 'Мраморная ванна'],
      availableRooms: 10,
      pricePerNight: '16500.00',
    },
    {
      name: 'Люкс с видом на площадь Искусств',
      imageUrl: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461',
      capacityAdults: 2,
      capacityChildren: 2,
      hasBreakfast: true,
      hasFreeCancellation: true,
      tags: ['Антикварная мебель', 'Вид на площадь Искусств', 'Гостиная', 'Кофемашина'],
      availableRooms: 5,
      pricePerNight: '28000.00',
    },
  ],
  'Hyatt Regency Ekaterinburg': [
    {
      name: 'Стандарт King',
      imageUrl: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304',
      capacityAdults: 2,
      capacityChildren: 1,
      hasBreakfast: false,
      hasFreeCancellation: true,
      tags: ['King size кровать', 'Панорамные окна', 'Рабочее место', 'Wi-Fi'],
      availableRooms: 20,
      pricePerNight: '8900.00',
    },
    {
      name: 'Клубный номер с завтраком',
      imageUrl: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39',
      capacityAdults: 2,
      capacityChildren: 1,
      hasBreakfast: true,
      hasFreeCancellation: true,
      tags: ['Доступ в Regency Club', 'Завтрак и вечерние коктейли', 'Вид на набережную'],
      availableRooms: 15,
      pricePerNight: '11500.00',
    },
    {
      name: 'Представительский люкс',
      imageUrl: 'https://images.unsplash.com/photo-1591088398332-8a7791972843',
      capacityAdults: 2,
      capacityChildren: 2,
      hasBreakfast: true,
      hasFreeCancellation: true,
      tags: ['Панорамный вид на городской пруд', 'Гостиная', 'Ванная с окном', 'Гардеробная'],
      availableRooms: 10,
      pricePerNight: '19000.00',
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

  const initialHotels: HotelSeed[] = [
    {
      name: 'Radisson Blu Resort & Congress Centre',
      description:
        'Роскошный курортный отель на первой линии черноморского побережья с собственным пляжем, открытыми бассейнами и спа-центром Pace Health Club.',
      address: 'ул. Голубая, 1А',
      city: 'Сочи',
      stars: 5,
      locationTag: 'Первая линия, 100 м до моря',
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
      tags: ['Бассейн', 'Спа', 'Первая линия', 'Фитнес-центр', 'Ресторан', 'Парковка'],
      hasBreakfast: true,
      availableRooms: 50,
      pricePerNight: '9500.00',
    },
    {
      name: 'Grand Hotel Polyana',
      description:
        'Флагманский отель в живописной долине реки Ачипсе посреди Кавказских гор, окруженный реликтовым лесом, с 50-метровым олимпийским бассейном.',
      address: 'ул. Ачипсинская, 16',
      city: 'Сочи',
      stars: 5,
      locationTag: 'Красная Поляна, у подъемников',
      imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd',
      tags: ['Бассейн', 'Спа', 'Вид на горы', 'Теннисный корт', 'Детский клуб', 'Ресторан'],
      hasBreakfast: true,
      availableRooms: 35,
      pricePerNight: '14000.00',
    },
    {
      name: 'Cosmos Moscow Hotel',
      description:
        'Легендарный отель в шаговой доступности от ВДНХ и парка Останкино, предлагающий современные комфортные номера для деловых поездок и отдыха.',
      address: 'пр-т Мира, 150',
      city: 'Москва',
      stars: 3,
      locationTag: 'ВДНХ, 200 м до метро',
      imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4',
      tags: ['Wi-Fi', 'Метро рядом', 'Конференц-залы', 'Фитнес-центр', 'Ресторан'],
      hasBreakfast: false,
      availableRooms: 120,
      pricePerNight: '4500.00',
    },
    {
      name: 'Marriott Krasnaya Polyana',
      description:
        'Пятизвездочный премиальный отель в самом центре круглогодичного горного курорта со прямым выходом к канатной дороге и спа-комплексом Soul Spa.',
      address: 'наб. Времена Года, 1',
      city: 'Сочи',
      stars: 5,
      locationTag: 'Центр курорта Горки Город',
      imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb',
      tags: ['Спа', 'Ski-in/Ski-out', 'Крытый бассейн', 'Казино', 'Вид на горы', 'Ресторан'],
      hasBreakfast: true,
      availableRooms: 25,
      pricePerNight: '18000.00',
    },
    {
      name: 'Bridge Resort Sochi',
      description:
        'Семейный санаторно-курортный комплекс в Имеретинской низменности с комплексом бассейнов, собственным галечным пляжем и развитой анимацией.',
      address: 'ул. Фигурная, 45',
      city: 'Сочи',
      stars: 4,
      locationTag: 'Имеретинская низменность, 300 м до моря',
      imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d',
      tags: ['Семейный отдых', 'Бассейн', 'Собственный пляж', 'Детская анимация', 'Медицинский центр'],
      hasBreakfast: true,
      availableRooms: 40,
      pricePerNight: '7800.00',
    },
    {
      name: 'Grand Hotel Europe',
      description:
        'Старейший гранд-отель Санкт-Петербурга с вековой историей и изысканной архитектурой в стиле ар-нуво рядом с Русским музеем и филармонией.',
      address: 'ул. Михайловская, 1/7',
      city: 'Санкт-Петербург',
      stars: 5,
      locationTag: 'Невский проспект, 200 м до Эрмитажа',
      imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa',
      tags: ['Историческое здание', 'Ресторан высокой кухни', 'В центре города', 'Консьерж-сервис', 'Спа'],
      hasBreakfast: true,
      availableRooms: 30,
      pricePerNight: '15000.00',
    },
    {
      name: 'Hyatt Regency Ekaterinburg',
      description:
        'Премиальный пятизвездочный отель на берегу городского пруда в деловом центре Екатеринбурга с панорамным фитнес-центром The Myst Club.',
      address: 'ул. Бориса Ельцина, 8',
      city: 'Екатеринбург',
      stars: 5,
      locationTag: 'Набережная Рабочей Молодёжи, центр',
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
      tags: ['Центр города', 'Панорамный вид', 'Бассейн', 'Спа', 'Конференц-залы', 'Ресторан'],
      hasBreakfast: true,
      availableRooms: 45,
      pricePerNight: '8900.00',
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
            description: hotel.description,
            address: hotel.address,
            city: hotel.city,
            stars: hotel.stars,
            locationTag: hotel.locationTag,
            imageUrl: hotel.imageUrl,
            tags: hotel.tags,
            hasBreakfast: hotel.hasBreakfast,
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
          .where(eq(hotelRooms.hotelId, hotel.id))
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
