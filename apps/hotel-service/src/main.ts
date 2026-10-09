import { NestFactory, Reflector } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import {
  HttpExceptionFilter,
  TransformResponseInterceptor,
  ChaosInterceptor,
  setupSwagger,
} from '@t-amada/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('HotelService');
  const reflector = app.get(Reflector);
  const configService = app.get(ConfigService);

  const apiPrefix = configService.get<string>('API_PREFIX', 'api/v1/hotel');

  app.setGlobalPrefix(apiPrefix, {
    exclude: ['health', 'health/(.*)'],
  });

  // Global pipes & filters & interceptors from libs/common
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ChaosInterceptor(), new TransformResponseInterceptor(reflector));

  // Swagger setup at ${apiPrefix}/docs
  setupSwagger(app, {
    title: 'Hotel Service API',
    routePrefix: `${apiPrefix}/docs`,
  });

  const port = configService.get<number>('PORT', 3002);

  await app.listen(port);
  logger.log(`HotelService is running on port ${port}`);
  logger.log(`Health check available at http://localhost:${port}/health`);
  logger.log(`Swagger documentation available at http://localhost:${port}/${apiPrefix}/docs`);
}

bootstrap();
