import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";

interface UpdateToneCommandProps {
  toneId: UniqueEntityId;
  name: string;
  body: string;
}

export class UpdateToneCommand {
  constructor(public readonly props: UpdateToneCommandProps) {
    this.validateProps(props);
  }

  private validateProps(props: UpdateToneCommandProps): void {}
}
