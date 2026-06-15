import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ) {

  const request =
    context.switchToHttp()
      .getRequest();

  const now = Date.now();

  console.log(
    `${request.method} ${request.url}`,
  );

  return next.handle().pipe(
    tap(() => {

      console.log(
        `${request.method} ${request.url} ${
          Date.now() - now
        }ms`,
      );

    }),
  );
}
}