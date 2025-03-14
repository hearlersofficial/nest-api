import { DomainEventCollector } from "~shared/core/infrastructure/events/domain-event-collector";

import { Global, Module } from "@nestjs/common";

@Global()
@Module({
  providers: [DomainEventCollector],
  exports: [DomainEventCollector],
})
export class DomainEventsModule {}
