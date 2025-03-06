import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { isDefined } from "~shared/utils/Validate.utils";
import { Contexts } from "~counselings/aggregates/contexts/domain/contexts";

import { HttpStatus } from "@nestjs/common";
interface CreateContextCommandProps {
  name: string;
  body: string;
  placeholders: string[];
}

export interface CreateContextCommandResponse {
  context: Contexts;
}

export class CreateContextCommand {
  constructor(public readonly props: CreateContextCommandProps) {
    this.validateProps(props);
  }

  private validateProps(props: CreateContextCommandProps): void {
    if (!isDefined(props.name)) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "Prompt is required");
    }
    if (!isDefined(props.body)) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "Body is required");
    }
    if (!isDefined(props.placeholders)) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "Placeholders is required");
    }
  }
}
