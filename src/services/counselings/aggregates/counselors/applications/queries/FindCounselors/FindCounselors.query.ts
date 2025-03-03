import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";

export class FindCounselorsQuery {
  constructor(public readonly props: FindCounselorsQueryProps) {
    this.validateProps(props);
  }

  private validateProps(props: FindCounselorsQueryProps): void {}
}

interface FindCounselorsQueryProps {
  toneId?: UniqueEntityId;
}
