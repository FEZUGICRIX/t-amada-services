import 'dotenv/config';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { sql } from 'drizzle-orm';
import * as schema from './schema';
import { flights, type DbFlightStop } from './schema';

async function seed() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not defined in environment variables');
  }

  const pool = new Pool({ connectionString });
  const db = drizzle(pool, { schema });

  console.log('🌱 [flight-service] Seeding initial flights data...');

  const initialFlights = [
    // 1. Прямой рейс Москва -> Сочи (Аэрофлот, SVO -> AER)
    {
      flightNumber: 'SU-1120',
      airlineCode: 'SU',
      airlineName: 'Аэрофлот',
      departureCity: 'Москва',
      arrivalCity: 'Сочи',
      departureAirport: 'SVO',
      arrivalAirport: 'AER',
      departureTime: new Date('2026-11-15T08:30:00+03:00'),
      arrivalTime: new Date('2026-11-15T12:15:00+03:00'),
      departureUtcOffsetMinutes: 180,
      arrivalUtcOffsetMinutes: 180,
      stopsCount: 0,
      stops: [] as DbFlightStop[],
      segmentMinutes: [225],
      hasBaggage: true,
      baggageWeightKg: 23,
      flightClass: 'ECONOMY' as const,
      flightType: 'OUTBOUND',
      availableSeats: 150,
      price: '8500.00',
    },
    // 2. Прямой рейс Москва -> Сочи (Победа, VKO -> AER)
    {
      flightNumber: 'DP-401',
      airlineCode: 'DP',
      airlineName: 'Победа',
      departureCity: 'Москва',
      arrivalCity: 'Сочи',
      departureAirport: 'VKO',
      arrivalAirport: 'AER',
      departureTime: new Date('2026-11-15T12:45:00+03:00'),
      arrivalTime: new Date('2026-11-15T16:25:00+03:00'),
      departureUtcOffsetMinutes: 180,
      arrivalUtcOffsetMinutes: 180,
      stopsCount: 0,
      stops: [] as DbFlightStop[],
      segmentMinutes: [220],
      hasBaggage: false,
      baggageWeightKg: null,
      flightClass: 'ECONOMY' as const,
      flightType: 'OUTBOUND',
      availableSeats: 60,
      price: '5900.00',
    },
    // 3. Прямой рейс Москва -> Сочи (S7 Airlines, DME -> AER, Бизнес)
    {
      flightNumber: 'S7-2041',
      airlineCode: 'S7',
      airlineName: 'S7 Airlines',
      departureCity: 'Москва',
      arrivalCity: 'Сочи',
      departureAirport: 'DME',
      arrivalAirport: 'AER',
      departureTime: new Date('2026-11-15T06:30:00+03:00'),
      arrivalTime: new Date('2026-11-15T10:15:00+03:00'),
      departureUtcOffsetMinutes: 180,
      arrivalUtcOffsetMinutes: 180,
      stopsCount: 0,
      stops: [] as DbFlightStop[],
      segmentMinutes: [225],
      hasBaggage: true,
      baggageWeightKg: 30,
      flightClass: 'BUSINESS' as const,
      flightType: 'OUTBOUND',
      availableSeats: 16,
      price: '18750.00',
    },
    // 4. Рейс с 1 пересадкой: Москва -> Сочи через Санкт-Петербург (SVO -> LED -> AER)
    // 90 мин полёт + 80 мин пересадка + 190 мин полёт = 360 мин
    {
      flightNumber: 'FV-6015',
      airlineCode: 'FV',
      airlineName: 'Россия + Аэрофлот',
      departureCity: 'Москва',
      arrivalCity: 'Сочи',
      departureAirport: 'SVO',
      arrivalAirport: 'AER',
      departureTime: new Date('2026-11-15T08:10:00+03:00'),
      arrivalTime: new Date('2026-11-15T14:10:00+03:00'),
      departureUtcOffsetMinutes: 180,
      arrivalUtcOffsetMinutes: 180,
      stopsCount: 1,
      stops: [
        {
          airport: 'LED',
          city: 'Санкт-Петербург',
          waitMinutes: 80,
          utcOffsetMinutes: 180,
        },
      ] as DbFlightStop[],
      segmentMinutes: [90, 190],
      hasBaggage: true,
      baggageWeightKg: 23,
      flightClass: 'ECONOMY' as const,
      flightType: 'OUTBOUND',
      availableSeats: 90,
      price: '11980.00',
    },
    // 5. Рейс с 1 пересадкой: Москва -> Сочи через Казань (SVO -> KZN -> AER)
    // 90 мин полёт + 60 мин пересадка + 150 мин полёт = 300 мин
    {
      flightNumber: 'N4-305',
      airlineCode: 'N4',
      airlineName: 'Nordwind Airlines',
      departureCity: 'Москва',
      arrivalCity: 'Сочи',
      departureAirport: 'SVO',
      arrivalAirport: 'AER',
      departureTime: new Date('2026-11-15T10:00:00+03:00'),
      arrivalTime: new Date('2026-11-15T15:00:00+03:00'),
      departureUtcOffsetMinutes: 180,
      arrivalUtcOffsetMinutes: 180,
      stopsCount: 1,
      stops: [
        {
          airport: 'KZN',
          city: 'Казань',
          waitMinutes: 60,
          utcOffsetMinutes: 180,
        },
      ] as DbFlightStop[],
      segmentMinutes: [90, 150],
      hasBaggage: true,
      baggageWeightKg: 20,
      flightClass: 'ECONOMY' as const,
      flightType: 'OUTBOUND',
      availableSeats: 75,
      price: '11350.00',
    },
    // 6. Рейс с 2 пересадками: Москва -> Сочи через Казань и Екатеринбург (SVO -> KZN -> SVX -> AER)
    // 80 мин + 60 мин wait + 75 мин + 55 мин wait + 190 мин = 460 мин
    {
      flightNumber: 'S7-2150',
      airlineCode: 'S7',
      airlineName: 'S7 + Аэрофлот',
      departureCity: 'Москва',
      arrivalCity: 'Сочи',
      departureAirport: 'SVO',
      arrivalAirport: 'AER',
      departureTime: new Date('2026-11-15T06:00:00+03:00'),
      arrivalTime: new Date('2026-11-15T13:40:00+03:00'),
      departureUtcOffsetMinutes: 180,
      arrivalUtcOffsetMinutes: 180,
      stopsCount: 2,
      stops: [
        {
          airport: 'KZN',
          city: 'Казань',
          waitMinutes: 60,
          utcOffsetMinutes: 180,
        },
        {
          airport: 'SVX',
          city: 'Екатеринбург',
          waitMinutes: 55,
          utcOffsetMinutes: 300,
        },
      ] as DbFlightStop[],
      segmentMinutes: [80, 75, 190],
      hasBaggage: true,
      baggageWeightKg: 23,
      flightClass: 'ECONOMY' as const,
      flightType: 'OUTBOUND',
      availableSeats: 45,
      price: '14300.00',
    },
    // 7. Ночной рейс с пересадкой и смещением дня (+1 день): Москва -> Сочи через Екатеринбург (DME -> SVX -> AER)
    // 140 мин полёт + 240 мин wait + 200 мин полёт = 580 мин
    {
      flightNumber: 'U6-2910',
      airlineCode: 'U6',
      airlineName: 'Уральские авиалинии',
      departureCity: 'Москва',
      arrivalCity: 'Сочи',
      departureAirport: 'DME',
      arrivalAirport: 'AER',
      departureTime: new Date('2026-11-15T21:30:00+03:00'),
      arrivalTime: new Date('2026-11-16T07:10:00+03:00'),
      departureUtcOffsetMinutes: 180,
      arrivalUtcOffsetMinutes: 180,
      stopsCount: 1,
      stops: [
        {
          airport: 'SVX',
          city: 'Екатеринбург',
          waitMinutes: 240,
          utcOffsetMinutes: 300,
        },
      ] as DbFlightStop[],
      segmentMinutes: [140, 200],
      hasBaggage: true,
      baggageWeightKg: 23,
      flightClass: 'ECONOMY' as const,
      flightType: 'OUTBOUND',
      availableSeats: 50,
      price: '10290.00',
    },
    // 8. Обратный прямой рейс: Сочи -> Москва (Аэрофлот, AER -> SVO)
    {
      flightNumber: 'SU-1121',
      airlineCode: 'SU',
      airlineName: 'Аэрофлот',
      departureCity: 'Сочи',
      arrivalCity: 'Москва',
      departureAirport: 'AER',
      arrivalAirport: 'SVO',
      departureTime: new Date('2026-11-17T14:00:00+03:00'),
      arrivalTime: new Date('2026-11-17T17:45:00+03:00'),
      departureUtcOffsetMinutes: 180,
      arrivalUtcOffsetMinutes: 180,
      stopsCount: 0,
      stops: [] as DbFlightStop[],
      segmentMinutes: [225],
      hasBaggage: true,
      baggageWeightKg: 23,
      flightClass: 'ECONOMY' as const,
      flightType: 'RETURN',
      availableSeats: 120,
      price: '8900.00',
    },
    // 9. Обратный рейс с 1 пересадкой: Сочи -> Москва через Санкт-Петербург (AER -> LED -> SVO)
    // 190 мин полёт + 90 мин wait + 95 мин полёт = 375 мин
    {
      flightNumber: 'FV-6016',
      airlineCode: 'FV',
      airlineName: 'Россия + Аэрофлот',
      departureCity: 'Сочи',
      arrivalCity: 'Москва',
      departureAirport: 'AER',
      arrivalAirport: 'SVO',
      departureTime: new Date('2026-11-17T10:00:00+03:00'),
      arrivalTime: new Date('2026-11-17T16:15:00+03:00'),
      departureUtcOffsetMinutes: 180,
      arrivalUtcOffsetMinutes: 180,
      stopsCount: 1,
      stops: [
        {
          airport: 'LED',
          city: 'Санкт-Петербург',
          waitMinutes: 90,
          utcOffsetMinutes: 180,
        },
      ] as DbFlightStop[],
      segmentMinutes: [190, 95],
      hasBaggage: true,
      baggageWeightKg: 23,
      flightClass: 'ECONOMY' as const,
      flightType: 'RETURN',
      availableSeats: 85,
      price: '12180.00',
    },
    // 10. Обратный рейс с 2 пересадками: Сочи -> Москва через Екатеринбург и Казань (AER -> SVX -> KZN -> DME)
    // 190 мин + 60 мин wait + 75 мин + 50 мин wait + 85 мин = 460 мин
    {
      flightNumber: 'S7-2151',
      airlineCode: 'S7',
      airlineName: 'S7 + Аэрофлот',
      departureCity: 'Сочи',
      arrivalCity: 'Москва',
      departureAirport: 'AER',
      arrivalAirport: 'DME',
      departureTime: new Date('2026-11-17T09:00:00+03:00'),
      arrivalTime: new Date('2026-11-17T16:40:00+03:00'),
      departureUtcOffsetMinutes: 180,
      arrivalUtcOffsetMinutes: 180,
      stopsCount: 2,
      stops: [
        {
          airport: 'SVX',
          city: 'Екатеринбург',
          waitMinutes: 60,
          utcOffsetMinutes: 300,
        },
        {
          airport: 'KZN',
          city: 'Казань',
          waitMinutes: 50,
          utcOffsetMinutes: 180,
        },
      ] as DbFlightStop[],
      segmentMinutes: [190, 75, 85],
      hasBaggage: true,
      baggageWeightKg: 23,
      flightClass: 'ECONOMY' as const,
      flightType: 'RETURN',
      availableSeats: 40,
      price: '14500.00',
    },
    // 11. Прямой рейс Москва -> Санкт-Петербург (SVO -> LED, Бизнес)
    {
      flightNumber: 'S7-2044',
      airlineCode: 'S7',
      airlineName: 'S7 Airlines',
      departureCity: 'Москва',
      arrivalCity: 'Санкт-Петербург',
      departureAirport: 'SVO',
      arrivalAirport: 'LED',
      departureTime: new Date('2026-11-12T10:15:00+03:00'),
      arrivalTime: new Date('2026-11-12T11:45:00+03:00'),
      departureUtcOffsetMinutes: 180,
      arrivalUtcOffsetMinutes: 180,
      stopsCount: 0,
      stops: [] as DbFlightStop[],
      segmentMinutes: [90],
      hasBaggage: true,
      baggageWeightKg: 30,
      flightClass: 'BUSINESS' as const,
      flightType: 'ONE_WAY',
      availableSeats: 12,
      price: '18500.00',
    },
    // 12. Прямой рейс Москва -> Калининград (VKO -> KGD, UTC+2)
    // 06:00 MSK (03:00 UTC) -> 08:40 KGD (06:40 UTC) = 220 мин
    {
      flightNumber: 'DP-402',
      airlineCode: 'DP',
      airlineName: 'Победа',
      departureCity: 'Москва',
      arrivalCity: 'Калининград',
      departureAirport: 'VKO',
      arrivalAirport: 'KGD',
      departureTime: new Date('2026-11-15T06:00:00+03:00'),
      arrivalTime: new Date('2026-11-15T08:40:00+02:00'),
      departureUtcOffsetMinutes: 180,
      arrivalUtcOffsetMinutes: 120,
      stopsCount: 0,
      stops: [] as DbFlightStop[],
      segmentMinutes: [220],
      hasBaggage: false,
      baggageWeightKg: null,
      flightClass: 'ECONOMY' as const,
      flightType: 'ONE_WAY',
      availableSeats: 45,
      price: '4900.00',
    },
    // 13. Прямой рейс Москва -> Тюмень (VKO -> TJM, UTC+5)
    // 23:50 MSK (20:50 UTC) -> 04:45 TJM (23:45 UTC) = 175 мин
    {
      flightNumber: 'UT-365',
      airlineCode: 'UT',
      airlineName: 'ЮТэйр',
      departureCity: 'Москва',
      arrivalCity: 'Тюмень',
      departureAirport: 'VKO',
      arrivalAirport: 'TJM',
      departureTime: new Date('2026-11-18T23:50:00+03:00'),
      arrivalTime: new Date('2026-11-19T04:45:00+05:00'),
      departureUtcOffsetMinutes: 180,
      arrivalUtcOffsetMinutes: 300,
      stopsCount: 0,
      stops: [] as DbFlightStop[],
      segmentMinutes: [175],
      hasBaggage: true,
      baggageWeightKg: 20,
      flightClass: 'ECONOMY' as const,
      flightType: 'ONE_WAY',
      availableSeats: 80,
      price: '6300.00',
    },
  ];

  // Проверка строгих инвариантов перед вставкой в БД
  for (const flight of initialFlights) {
    if (flight.segmentMinutes.length !== flight.stops.length + 1) {
      throw new Error(
        `[Invariant Violation] Flight ${flight.flightNumber}: segmentMinutes length (${flight.segmentMinutes.length}) must equal stops.length + 1 (${flight.stops.length + 1})`,
      );
    }
    if (flight.stopsCount !== flight.stops.length) {
      throw new Error(
        `[Invariant Violation] Flight ${flight.flightNumber}: stopsCount (${flight.stopsCount}) must equal stops.length (${flight.stops.length})`,
      );
    }
    const diffMinutes = Math.round(
      (flight.arrivalTime.getTime() - flight.departureTime.getTime()) / 60000,
    );
    const sumSegments = flight.segmentMinutes.reduce((sum, m) => sum + m, 0);
    const sumWait = flight.stops.reduce((sum, s) => sum + s.waitMinutes, 0);
    if (diffMinutes !== sumSegments + sumWait) {
      throw new Error(
        `[Invariant Violation] Flight ${flight.flightNumber}: arrival - departure (${diffMinutes} min) must equal sum(segmentMinutes) + sum(waitMinutes) (${sumSegments + sumWait} min)`,
      );
    }
  }

  try {
    await db
      .insert(flights)
      .values(initialFlights)
      .onConflictDoUpdate({
        target: flights.flightNumber,
        set: {
          airlineCode: sql`excluded.airline_code`,
          airlineName: sql`excluded.airline_name`,
          departureCity: sql`excluded.departure_city`,
          arrivalCity: sql`excluded.arrival_city`,
          departureAirport: sql`excluded.departure_airport`,
          arrivalAirport: sql`excluded.arrival_airport`,
          departureTime: sql`excluded.departure_time`,
          arrivalTime: sql`excluded.arrival_time`,
          departureUtcOffsetMinutes: sql`excluded.departure_utc_offset_minutes`,
          arrivalUtcOffsetMinutes: sql`excluded.arrival_utc_offset_minutes`,
          stopsCount: sql`excluded.stops_count`,
          stops: sql`excluded.stops`,
          segmentMinutes: sql`excluded.segment_minutes`,
          hasBaggage: sql`excluded.has_baggage`,
          baggageWeightKg: sql`excluded.baggage_weight_kg`,
          flightClass: sql`excluded.flight_class`,
          flightType: sql`excluded.flight_type`,
          availableSeats: sql`excluded.available_seats`,
          price: sql`excluded.price`,
        },
      });
    console.log('✅ [flight-service] Seeding completed successfully!');
  } finally {
    await pool.end();
  }
}

seed().catch((err) => {
  console.error('❌ [flight-service] Seeding failed:', err);
  process.exit(1);
});
