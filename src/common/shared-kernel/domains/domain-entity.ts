import { isDefined } from "~common/shared/utils/validate";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";

export interface DomainEntityProps {
  [index: string]: any;
}

export abstract class DomainEntity<Props extends DomainEntityProps, IdType extends UniqueEntityId = UniqueEntityId> {
  protected readonly _id: IdType;
  protected props: Props;

  protected constructor(props: Props, id: IdType) {
    this._id = id;
    this.props = props;
  }

  public isNew(): boolean {
    return this._id.isNewIdentifier();
  }

  get id(): IdType {
    return this._id;
  }

  get propsValue(): Props {
    return this.props;
  }

  public equals(other?: DomainEntity<Props, IdType>): boolean {
    return this.id.equals(other?.id);
  }

  protected createAssignIfDefined(updates: Partial<Props>): (key: keyof Props) => void {
    return <K extends keyof typeof updates>(key: K) => {
      if (key in updates) {
        const value = updates[key];
        if (isDefined(value)) {
          this.props[key] = value;
        }
      }
    };
  }
}
