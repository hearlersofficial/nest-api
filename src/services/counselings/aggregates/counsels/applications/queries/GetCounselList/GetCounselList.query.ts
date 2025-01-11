import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";

import { HttpStatus } from "@nestjs/common";

export class GetCounselListQuery {
  constructor(public readonly props: GetCounselListQueryProps) {
    this.validateProps(props);
  }

  private validateProps(props: GetCounselListQueryProps): void {
    if (props.userId === null || props.userId === undefined) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "사용자 ID는 필수입니다.");
    }
  }
}

interface GetCounselListQueryProps {
  userId: number;
}
