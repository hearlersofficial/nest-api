import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";

import { HttpStatus } from "@nestjs/common";

export class FindCounselorByIdQuery {
  constructor(public readonly props: FindCounselorByIdQueryProps) {
    this.validateProps(props);
  }

  private validateProps(props: FindCounselorByIdQueryProps) {
    if (props.counselorId === null || props.counselorId === undefined) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "상담사 ID는 필수입니다.");
    }
  }
}

interface FindCounselorByIdQueryProps {
  counselorId: UniqueEntityId;
}
