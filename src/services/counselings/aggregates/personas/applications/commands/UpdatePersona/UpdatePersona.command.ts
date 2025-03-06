import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { Personas } from "~counselings/aggregates/personas/domain/personas";

import { HttpStatus } from "@nestjs/common";

interface UpdatePersonaCommandProps {
  personaId: UniqueEntityId;
  body?: string;
}

export class UpdatePersonaCommand {
  constructor(public readonly props: UpdatePersonaCommandProps) {
    this.validate(props);
  }

  private validate(props: UpdatePersonaCommandProps): void {
    if (props.personaId === null || props.personaId === undefined) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "personaId는 필수입니다.");
    }
  }
}

export interface UpdatePersonaCommandResult {
  persona: Personas;
}
