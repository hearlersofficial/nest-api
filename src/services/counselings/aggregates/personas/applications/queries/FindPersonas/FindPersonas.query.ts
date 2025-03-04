import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";

import { HttpStatus } from "@nestjs/common";

export interface FindPersonasQueryProps {
  counselorId?: UniqueEntityId;
}

export class FindPersonasQuery {
  constructor(public readonly props: FindPersonasQueryProps) {
    this.validate();
  }

  validate(): void {
    if (!this.props.counselorId) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "counselorId is required");
    }
  }
}
