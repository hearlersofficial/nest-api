import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { CounselTechniqueStage } from "~proto/com/hearlers/v1/model/counsel_pb";

import { HttpStatus } from "@nestjs/common";

interface UpdateCounselTechniqueCommandProps {
  techniqueId: UniqueEntityId;
  name?: string;
  toneId?: UniqueEntityId | null;
  contextId?: UniqueEntityId;
  instructionId?: UniqueEntityId;
  counselTechniqueStage?: CounselTechniqueStage;
  nextTechniqueId?: UniqueEntityId | null;
}

export class UpdateCounselTechniqueCommand {
  constructor(public readonly props: UpdateCounselTechniqueCommandProps) {
    this.validateProps(props);
  }
  private validateProps(props: UpdateCounselTechniqueCommandProps): void {
    if (props.techniqueId === null || props.techniqueId === undefined) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "techniqueId는 필수입니다.");
    }
  }
}
