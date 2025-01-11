import { DomainEntity } from "~shared/core/domain/DomainEntity";
import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";

export abstract class AggregateRoot<T> extends DomainEntity<T> {
  protected constructor(props: T, id?: UniqueEntityId) {
    super(props, id);
  }
}
