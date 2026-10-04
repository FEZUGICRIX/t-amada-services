import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { HttpExceptionFilter, createValidationPipe, ChaosInterceptor } from '@t-amada/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('HotelService');

  // Global pipes & filters & interceptors from libs/common
  app.useGlobalPipes(createValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ChaosInterceptor());

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3002);

  await app.listen(port);
  logger.log(`HotelService is running on port ${port}`);
}

bootstrap();
