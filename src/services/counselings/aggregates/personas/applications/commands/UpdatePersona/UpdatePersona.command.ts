import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { Personas, PersonasNewProps } from "~counselings/aggregates/personas/domain/personas";

import { HttpStatus } from "@nestjs/common";

// TODO
export class UpdatePersonaCommand {
  constructor(public readonly props: PersonasNewProps) {
    this.validate(props);
  }

  private validate(props: PersonasNewProps): void {
    if (props.body === null || props.body === undefined) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "이름은 필수입니다.");
    }
  }
}

export interface CreatePersonaCommandResult {
  persona: Personas;
}
