import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { CounselorGender, CounselorType } from "~proto/com/hearlers/v1/model/counsel_pb";

import { HttpStatus } from "@nestjs/common";
<<<<<<< HEAD:src/services/counselings/aggregates/counselors/applications/commands/UpdateCounselor/UpdateCounselor.command.ts
=======
import { CounselorGender, CounselorType } from "~/src/gen/com/hearlers/v1/model/counsel_pb";
import { UniqueEntityId } from "~/src/shared/core/domain/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~/src/shared/filters/exceptions";
>>>>>>> 270a161 (feat: snowflakeid 추가 새 프로덕트에 맞는 디비 구조 정립):src/aggregates/counselors/applications/commands/UpdateCounselor/UpdateCounselor.command.ts

export class UpdateCounselorCommand {
  constructor(public readonly props: UpdateCounselorCommandProps) {
    this.validate(props);
  }

  private validate(props: UpdateCounselorCommandProps): void {
    if (props.counselorId === null || props.counselorId === undefined) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "상담사 ID는 필수입니다.");
    }

    if (props.counselorType !== null && props.counselorType !== undefined) {
      if (!Object.values(CounselorType).includes(props.counselorType)) {
        throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "유효하지 않은 상담사 타입입니다.");
      }
      if (props.counselorType === CounselorType.UNSPECIFIED) {
        throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "상담사 타입이 지정되지 않았습니다.");
      }
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
  counselorType?: CounselorType;
  name?: string;
  description?: string;
  gender?: CounselorGender;
}
