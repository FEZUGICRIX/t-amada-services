import { Global, Module, OnApplicationShutdown, Logger, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

export const DRIZZLE = 'DRIZZLE';
export const PG_POOL = 'PG_POOL';

export type DrizzleDB = NodePgDatabase<typeof schema>;

const pgPoolProvider = {
  provide: PG_POOL,
  inject: [ConfigService],
  useFactory: (configService: ConfigService): Pool => {
    const connectionString = configService.getOrThrow<string>('DATABASE_URL');
    return new Pool({
      connectionString,
    });
  },
};

const drizzleProvider = {
  provide: DRIZZLE,
  inject: [PG_POOL],
  useFactory: (pool: Pool): DrizzleDB => {
    return drizzle(pool, { schema });
  },
};

@Global()
@Module({
  providers: [pgPoolProvider, drizzleProvider],
  exports: [DRIZZLE, PG_POOL],
})
export class DatabaseModule implements OnApplicationShutdown {
  private readonly logger = new Logger(DatabaseModule.name);

  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async onApplicationShutdown() {
    this.logger.log('Closing PostgreSQL connection pool...');
    await this.pool.end();
  }
}
