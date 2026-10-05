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
  const logger = new Logger('FlightService');
  const reflector = app.get(Reflector);

  // Global pipes & filters & interceptors from libs/common
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ChaosInterceptor(), new TransformResponseInterceptor(reflector));

  // Swagger setup at /api/docs
  setupSwagger(app, {
    title: 'Flight Service API',
    routePrefix: 'api/docs',
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3001);

  await app.listen(port);
  logger.log(`FlightService is running on port ${port}`);
  logger.log(`Swagger documentation available at http://localhost:${port}/api/docs`);
}

bootstrap();
