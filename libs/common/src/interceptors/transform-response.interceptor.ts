import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponseDto } from '../dto/api-response.dto';

export const BYPASS_TRANSFORM_KEY = 'BYPASS_TRANSFORM';
export const BypassTransform = () => SetMetadata(BYPASS_TRANSFORM_KEY, true);

@Injectable()
export class TransformResponseInterceptor<T> implements NestInterceptor<T, ApiResponseDto<T> | T> {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<ApiResponseDto<T> | T> {
    const isBypassed = this.reflector.getAllAndOverride<boolean>(BYPASS_TRANSFORM_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isBypassed) {
      return next.handle();
    }

    return next.handle().pipe(map((data: T) => new ApiResponseDto(data ?? null)));
  }
}
