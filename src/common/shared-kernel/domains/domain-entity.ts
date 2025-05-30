import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";

export interface DomainEntityProps {
  [index: string]: any;
}

export abstract class DomainEntity<Props extends DomainEntityProps> {
  protected readonly _id: UniqueEntityId;
  protected props: Props;

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

  public equals(other?: DomainEntity<Props>): boolean {
    return this.id.equals(other?.id);
  }
}
