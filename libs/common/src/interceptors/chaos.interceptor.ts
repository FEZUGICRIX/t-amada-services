import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class ChaosInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ChaosInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    // Scaffold / stub for Chaos engineering simulations (e.g. latency injection, randomized errors)
    return next.handle();
  }
}
