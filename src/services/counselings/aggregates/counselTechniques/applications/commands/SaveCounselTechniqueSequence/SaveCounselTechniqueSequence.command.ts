import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { isDefined } from "~shared/utils/Validate.utils";
import { CounselTechniques } from "~counselings/aggregates/counselTechniques/domain/counselTechniques";

import { HttpStatus } from "@nestjs/common";

interface SaveCounselTechniqueSequenceCommandProps {
  counselTechniqueIds: UniqueEntityId[];
}

export interface SaveCounselTechniqueSequenceCommandResponse {
  counselTechniques: CounselTechniques[];
}

export class SaveCounselTechniqueSequenceCommand {
  constructor(public readonly props: SaveCounselTechniqueSequenceCommandProps) {
    this.validateProps(props);
  }

  private validateProps(props: SaveCounselTechniqueSequenceCommandProps): void {
    if (!isDefined(props.counselTechniqueIds)) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "counselTechniqueIds is required");
    }
    if (props.counselTechniqueIds.length === 0) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "counselTechniqueIds cannot be empty");
    }
    // ids의 값들 중 중복이 있는지 확인
    if (new Set(props.counselTechniqueIds.map((id) => id.getString())).size !== props.counselTechniqueIds.length) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "counselTechniqueIds cannot have duplicates");
    }
  }
}
