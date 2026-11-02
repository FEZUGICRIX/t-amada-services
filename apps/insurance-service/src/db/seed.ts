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
    {
      title: 'Базовый медицинский полис',
      planType: 'BASIC' as const,
      coverageAmount: '2000000.00',
      coveredRisks: [
        'Экстренная медицинская помощь',
        'Амбулаторное лечение',
        'Медикаменты по назначению врача',
        'Медицинская транспортировка',
      ],
      exclusions: 'Хронические заболевания, солнечные ожоги, алкогольное опьянение',
      price: '1200.00',
    },
    {
      title: 'Стандартная защита туриста и багажа',
      planType: 'BASIC' as const,
      coverageAmount: '3500000.00',
      coveredRisks: [
        'Экстренная медицинская помощь',
        'Амбулаторное и стационарное лечение',
        'Экстренная стоматология',
        'Утрата или задержка багажа',
        'Медицинская эвакуация',
      ],
      exclusions: 'Хронические заболевания, экстремальные виды спорта без дополнительной опции',
      price: '2500.00',
    },
    {
      title: 'Премиум Все Включено (Extended Shield)',
      planType: 'EXTENDED' as const,
      coverageAmount: '6000000.00',
      coveredRisks: [
        'Экстренная медицинская помощь в клиниках высшей категории',
        'Полная оплата медикаментов и высокотехнологичных обследований',
        'Экстренная стоматология до $1000',
        'Задержка и отмена рейса',
        'Утрата багажа и документов',
        'Юридическая поддержка за рубежом',
        'Досрочное возвращение близких родственников',
      ],
      exclusions: 'Умышленные противоправные действия, военные действия',
      price: '5500.00',
    },
    {
      title: 'Экстрим & Активный спорт (Extended)',
      planType: 'EXTENDED' as const,
      coverageAmount: '5000000.00',
      coveredRisks: [
        'Экстренная медицинская помощь при спортивных травмах',
        'Поисково-спасательные операции и эвакуация вертолетом',
        'Горнолыжный спорт, сноубординг, трекинг и дайвинг',
        'Эвакуация и репатриация',
      ],
      exclusions: 'Профессиональные соревнования без персональной спортивной лицензии',
      price: '4000.00',
    },
  ];

  try {
    for (const policy of initialPolicies) {
      await db
        .insert(insurancePolicies)
        .values(policy)
        .onConflictDoUpdate({
          target: insurancePolicies.title,
          set: {
            planType: policy.planType,
            coverageAmount: policy.coverageAmount,
            coveredRisks: policy.coveredRisks,
            exclusions: policy.exclusions,
            price: policy.price,
          },
        });
    }
    console.log('✅ [insurance-service] Seeding completed successfully!');
  } finally {
    await pool.end();
  }
}

seed().catch((err) => {
  console.error('❌ [insurance-service] Seeding failed:', err);
  process.exit(1);
});
