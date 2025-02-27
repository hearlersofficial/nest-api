import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { isDefined } from "~shared/utils/Validate.utils";

import { HttpStatus } from "@nestjs/common";
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
