import { DomainEntity } from "~shared/core/domain/DomainEntity";
import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
export type AggregateRootProps = {
  [index: string]: any;
};

export abstract class AggregateRoot<T extends AggregateRootProps> extends DomainEntity<T> {
  protected constructor(props: T, id: UniqueEntityId) {
    super(props, id);
  }
}
