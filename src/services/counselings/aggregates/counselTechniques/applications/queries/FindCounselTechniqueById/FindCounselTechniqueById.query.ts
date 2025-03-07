import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";

import { HttpStatus } from "@nestjs/common";

export class FindCounselTechniqueByIdQuery {
  constructor(public readonly techniqueId: UniqueEntityId) {
    this.validate();
  }

  validate(): void {
    if (!this.techniqueId) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "counselTechniqueId is required");
    }
  }
}
