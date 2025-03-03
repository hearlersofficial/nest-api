import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";

import { HttpStatus } from "@nestjs/common";

export class FindCounselByIdQuery {
  constructor(public readonly props: FindCounselByIdQueryProps) {
    this.validateProps(props);
  }

  private validateProps(props: FindCounselByIdQueryProps): void {
    if (props.counselId === null || props.counselId === undefined) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "상담 ID는 필수입니다.");
    }
  }
}

interface FindCounselByIdQueryProps {
  counselId: UniqueEntityId;
}
