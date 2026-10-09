import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3002),
  SERVICE_NAME: z.string().default('hotel-service'),
  API_PREFIX: z.string().default('api/v1/hotel'),
  DATABASE_URL: z.string().url(),
});

export type EnvConfig = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>) {
  const result = envSchema.safeParse(config);

  if (!result.success) {
    const formattedErrors = JSON.stringify(result.error.format(), null, 2);
    throw new Error(`Environment validation failed for hotel-service:\n${formattedErrors}`);
  }

  return {
    ...config,
    ...result.data,
  };
}
