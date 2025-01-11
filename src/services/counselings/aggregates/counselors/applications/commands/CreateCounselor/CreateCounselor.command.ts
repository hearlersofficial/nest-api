import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { CounselorGender, CounselorType } from "~proto/com/hearlers/v1/model/counsel_pb";

import { HttpStatus } from "@nestjs/common";

export class CreateCounselorCommand {
  constructor(public readonly props: CreateCounselorCommandProps) {
    this.validate(props);
  }

  private validate(props: CreateCounselorCommandProps): void {
    if (props.counselorType === null || props.counselorType === undefined) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "상담사 타입은 필수입니다.");
    }
    if (!Object.values(CounselorType).includes(props.counselorType)) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "유효하지 않은 상담사 타입입니다.");
    }
    if (props.counselorType === CounselorType.UNSPECIFIED) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "상담사 타입이 지정되지 않았습니다.");
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
  counselorType: CounselorType;
  name: string;
  description: string;
  gender: CounselorGender;
}
