import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule, OpenAPIObject } from '@nestjs/swagger';
import { ApiResponseDto } from '../dto/api-response.dto';
import { ErrorResponseDto } from '../filters/error-response.dto';

export interface SwaggerSetupOptions {
  title: string;
  description?: string;
  version?: string;
  routePrefix?: string;
}

export function setupSwagger(app: INestApplication, options: SwaggerSetupOptions): OpenAPIObject {
  const routePrefix = options.routePrefix ?? 'api/docs';

  const config = new DocumentBuilder()
    .setTitle(options.title)
    .setDescription(
      options.description ??
        `REST API documentation for ${options.title} in T-Travel Booking Services`,
    )
    .setVersion(options.version ?? '1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [ApiResponseDto, ErrorResponseDto],
  });

  SwaggerModule.setup(routePrefix, app, document, {
    swaggerOptions: {
      displayRequestDuration: true,
      docExpansion: 'list',
      filter: true,
    },
    customSiteTitle: options.title,
  });

  return document;
}
