import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { isDefined } from "~shared/utils/Validate.utils";
import { CounselTechniqueStage } from "~proto/com/hearlers/v1/model/counsel_pb";

import { HttpStatus } from "@nestjs/common";

export interface FindCounselTechniquesQueryProps {
  name?: string;
  toneId?: UniqueEntityId;
  counselTechniqueStage?: CounselTechniqueStage;
}

export class FindCounselTechniquesQuery {
  constructor(public readonly props: FindCounselTechniquesQueryProps) {
    this.validate();
  }

  validate(): void {
    if (isDefined(this.props.counselTechniqueStage)) {
      if (!Object.values(CounselTechniqueStage).includes(this.props.counselTechniqueStage)) {
        throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "유효하지 않은 단계입니다.");
      }
      if (this.props.counselTechniqueStage === CounselTechniqueStage.UNSPECIFIED) {
        throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "단계가 지정되지 않았습니다.");
      }
    }
  }
}
