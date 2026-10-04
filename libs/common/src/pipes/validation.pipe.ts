import { ValidationPipe, ValidationPipeOptions } from '@nestjs/common';

export const createValidationPipe = (options?: ValidationPipeOptions): ValidationPipe => {
  return new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
    ...options,
  });
};
