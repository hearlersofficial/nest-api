import { CounselCompressConditions } from "~counselings/domains/counsels/models/counsel-compress-conditions";

import { CounselId } from "~common/shared-kernel/identifiers/counsel.id";
import { CounselCompressConditionId } from "~common/shared-kernel/identifiers/counsel-compress-condition.id";

export abstract class CounselCompressConditionsRepository {
  abstract findById(compressConditionId: CounselCompressConditionId): Promise<CounselCompressConditions | null>;
  abstract findByCounselId(counselId: CounselId): Promise<CounselCompressConditions | null>;
  abstract save(compressCondition: CounselCompressConditions): Promise<CounselCompressConditions>;
  abstract save(compressConditions: CounselCompressConditions[]): Promise<CounselCompressConditions[]>;
}
