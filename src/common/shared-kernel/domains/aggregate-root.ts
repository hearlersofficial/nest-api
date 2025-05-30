import { DomainEntity } from "~common/shared-kernel/domains/domain-entity";
import { DomainEvent } from "~common/shared-kernel/domains/domain-event";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";

export type AggregateRootProps = {
  [index: string]: any;
};

export abstract class AggregateRoot<T extends AggregateRootProps> extends DomainEntity<T> {
  private _domainEvents: DomainEvent[] = [];

  protected constructor(props: T, id: UniqueEntityId) {
    super(props, id);
  }

  get domainEvents(): DomainEvent[] {
    return this._domainEvents;
  }

  protected addDomainEvent(domainEvent: DomainEvent): void {
    this._domainEvents.push(domainEvent);
  }

  public clearEvents(): void {
    this._domainEvents = [];
  }
}
