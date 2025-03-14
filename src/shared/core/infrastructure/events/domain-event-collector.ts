import { AggregateRoot } from "~shared/core/domain/AggregateRoot";
import { DomainEvent } from "~shared/core/domain/events/DomainEvent";
import { KAFKA_CLIENT } from "~shared/core/infrastructure/Config";

import { Inject, Injectable, Scope } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";

@Injectable({ scope: Scope.REQUEST })
export class DomainEventCollector {
  private collectedAggregates: AggregateRoot<any>[] = [];

  constructor(@Inject(KAFKA_CLIENT) private readonly kafkaProducer: ClientKafka) {}

  collectAggregate(aggregate: AggregateRoot<any> | AggregateRoot<any>[] | null | undefined): void {
    if (!aggregate) return;

    if (Array.isArray(aggregate)) {
      this.collectedAggregates.push(...aggregate);
    } else {
      this.collectedAggregates.push(aggregate);
    }
  }

  async publishCollectedEvents(): Promise<void> {
    const publishPromises: Promise<void>[] = [];

    for (const aggregate of this.collectedAggregates) {
      const domainEvents = aggregate.domainEvents;

      if (domainEvents.length === 0) continue;

      for (const domainEvent of domainEvents) {
        publishPromises.push(this.publishEvent(domainEvent));
      }

      aggregate.clearEvents();
    }

    await Promise.all(publishPromises);
    this.collectedAggregates = []; // 컬렉션 초기화
  }

  private async publishEvent(domainEvent: DomainEvent): Promise<void> {
    await this.kafkaProducer.emit(domainEvent.topic, domainEvent.binary);
  }
}
