import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { isDefined } from "~shared/utils/Validate.utils";
import { Tones } from "~counselings/aggregates/tones/domain/tones";

import { HttpStatus } from "@nestjs/common";
interface CreateToneCommandProps {
  name: string;
  body: string;
}

export interface CreateToneCommandResponse {
  tone: Tones;
}

export class CreateToneCommand {
  constructor(public readonly props: CreateToneCommandProps) {
    this.validateProps(props);
  }

  private validateProps(props: CreateToneCommandProps): void {
    if (!isDefined(props.name)) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "Name is required");
    }
    if (!isDefined(props.body)) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "Body is required");
    }
  }
}
