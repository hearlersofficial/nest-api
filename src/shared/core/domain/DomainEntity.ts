import { DomainEvent } from "~shared/core/domain/events/DomainEvent";
import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";

export interface DomainEntityProps {
  [index: string]: any;
}

export abstract class DomainEntity<Props extends DomainEntityProps> {
  protected readonly _id: UniqueEntityId;
  protected props: Props;
  private _domainEvents: DomainEvent[] = [];

  protected constructor(props: Props, id: UniqueEntityId) {
    this._id = id;
    this.props = props;
  }

  public isNew(): boolean {
    return this._id.isNewIdentifier();
  }

  get id(): UniqueEntityId {
    return this._id;
  }

  get propsValue(): Props {
    return this.props;
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

  public equals(other?: DomainEntity<Props>): boolean {
    return this.id.equals(other?.id);
  }
}
