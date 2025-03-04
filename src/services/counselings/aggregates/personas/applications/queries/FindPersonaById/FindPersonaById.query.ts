import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";

import { HttpStatus } from "@nestjs/common";

export class FindPersonaByIdQuery {
  constructor(public readonly personaId: UniqueEntityId) {
    this.validate();
  }

  validate(): void {
    if (!this.personaId) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "personaId is required");
    }
  }
}
