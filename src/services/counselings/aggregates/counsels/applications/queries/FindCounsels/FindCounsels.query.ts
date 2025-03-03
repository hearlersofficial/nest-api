import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";

import { HttpStatus } from "@nestjs/common";

export class FindCounselsQuery {
  constructor(public readonly props: FindCounselsQueryProps) {
    this.validateProps(props);
  }

  private validateProps(props: FindCounselsQueryProps): void {
    if (props.userId === null || props.userId === undefined) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "사용자 ID는 필수입니다.");
    }
  }
}

interface FindCounselsQueryProps {
  userId: UniqueEntityId;
  counselorId?: UniqueEntityId;
}
