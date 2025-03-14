import { DomainEventCollector } from "~shared/core/infrastructure/events/domain-event-collector";

import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";

@Injectable()
export class DomainEventsInterceptor implements NestInterceptor {
  constructor(private readonly domainEventCollector: DomainEventCollector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // 요청이 완료될 때 이벤트 발행
    return next.handle().pipe(
      tap(async () => {
        await this.domainEventCollector.publishCollectedEvents();
      }),
    );
  }
}
