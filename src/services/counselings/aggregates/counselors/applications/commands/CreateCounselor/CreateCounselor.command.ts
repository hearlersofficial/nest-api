import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { CounselorGender } from "~proto/com/hearlers/v1/model/counsel_pb";

import { HttpStatus } from "@nestjs/common";

export class CreateCounselorCommand {
  constructor(public readonly props: CreateCounselorCommandProps) {
    this.validate(props);
  }

  private validate(props: CreateCounselorCommandProps): void {
    if (props.toneId === null || props.toneId === undefined) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "상담사 ID는 필수입니다.");
    }

    if (props.name === null || props.name === undefined) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "상담사 이름은 필수입니다.");
    }

    if (props.description === null || props.description === undefined) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "상담사 설명은 필수입니다.");
    }

    if (props.gender === null || props.gender === undefined) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "성별은 필수입니다.");
    }
    if (!Object.values(CounselorGender).includes(props.gender)) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "유효하지 않은 성별입니다");
    }
    if (props.gender === CounselorGender.UNSPECIFIED) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "성별이 지정되지 않았습니다.");
    }
  }
}

interface CreateCounselorCommandProps {
  toneId: UniqueEntityId;
  name: string;
  description: string;
  gender: CounselorGender;
}
