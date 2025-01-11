import { CounselorType } from "~/src/gen/com/hearlers/v1/model/counsel_pb";
import { HttpStatusBasedRpcException } from "~/src/shared/filters/exceptions";

import { HttpStatus } from "@nestjs/common";

export class GetCounselorListQuery {
  constructor(public readonly props: GetCounselorListQueryProps) {
    this.validateProps(props);
  }

  private validateProps(props: GetCounselorListQueryProps): void {
    if (props.counselorType !== null && props.counselorType !== undefined) {
      if (!Object.values(CounselorType).includes(props.counselorType)) {
        throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "유효하지 않은 상담사 타입입니다.");
      }
      if (props.counselorType === CounselorType.UNSPECIFIED) {
        throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "상담사 타입이 지정되지 않았습니다.");
      }
    }
  }
}

interface GetCounselorListQueryProps {
  counselorType?: CounselorType;
}
