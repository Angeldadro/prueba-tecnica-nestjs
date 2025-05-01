import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { FastifyRequest as Request } from 'fastify';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();

    const req = ctx.getRequest<Request>();
    const { ip, method } = req;
    const originalUrl = req.url;
    const now = Date.now();

    return next.handle().pipe(
      finalize(() => {
        this.logger.log(
          `<-- ${method} ${originalUrl} - Duration: ${Date.now() - now}ms - IP: ${ip}`,
        );
      }),
    );
  }
}
