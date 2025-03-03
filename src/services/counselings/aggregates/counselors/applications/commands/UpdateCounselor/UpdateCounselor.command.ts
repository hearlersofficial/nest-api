import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { CounselorGender } from "~proto/com/hearlers/v1/model/counsel_pb";

import { HttpStatus } from "@nestjs/common";

export class UpdateCounselorCommand {
  constructor(public readonly props: UpdateCounselorCommandProps) {
    this.validate(props);
  }

  private validate(props: UpdateCounselorCommandProps): void {
    if (props.counselorId === null || props.counselorId === undefined) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "상담사 ID는 필수입니다.");
    }

    if (props.gender !== null && props.gender !== undefined) {
      if (!Object.values(CounselorGender).includes(props.gender)) {
        throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "유효하지 않은 성별입니다");
      }
      if (props.gender === CounselorGender.UNSPECIFIED) {
        throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "성별이 지정되지 않았습니다.");
      }
    }
  }
}

interface UpdateCounselorCommandProps {
  counselorId: UniqueEntityId;
  toneId?: UniqueEntityId;
  name?: string;
  description?: string;
  gender?: CounselorGender;
}
