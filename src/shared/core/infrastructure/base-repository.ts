import { DomainEventCollector } from "~shared/core/infrastructure/events/domain-event-collector";

export abstract class BaseRepository {
  constructor(protected readonly domainEventCollector: DomainEventCollector) {}
}
