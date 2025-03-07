import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { isDefined } from "~shared/utils/Validate.utils";
import { CounselTechniques } from "~counselings/aggregates/counselTechniques/domain/counselTechniques";
import { CounselTechniqueStage } from "~proto/com/hearlers/v1/model/counsel_pb";

import { HttpStatus } from "@nestjs/common";
interface CreateCounselTechniqueCommandProps {
  name: string;
  toneId: UniqueEntityId | null;
  contextId: UniqueEntityId;
  instructionId: UniqueEntityId;
  counselTechniqueStage: CounselTechniqueStage;
}

export interface CreateCounselTechniqueCommandResponse {
  counselTechnique: CounselTechniques;
}

export class CreateCounselTechniqueCommand {
  constructor(public readonly props: CreateCounselTechniqueCommandProps) {
    this.validateProps(props);
  }

  private validateProps(props: CreateCounselTechniqueCommandProps): void {
    if (!isDefined(props.name)) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "Name is required");
    }
    if (!isDefined(props.contextId)) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "ContextID is required");
    }
    if (!isDefined(props.instructionId)) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "InstructionID is required");
    }
    if (!isDefined(props.counselTechniqueStage)) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "Counsel Technique Stage is required");
    }
    if (!Object.values(CounselTechniqueStage).includes(props.counselTechniqueStage)) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "Invalid Counsel Technique Stage");
    }
    if (props.counselTechniqueStage === CounselTechniqueStage.UNSPECIFIED) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "Counsel Technique Stage is not specified");
    }
  }
}
