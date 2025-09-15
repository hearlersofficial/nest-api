import { CounselCompressConditions } from "~counselings/domains/counsels/models/counsel-compress-conditions";

import { CounselId } from "~common/shared-kernel/identifiers/counsel.id";
import { CounselCompressConditionId } from "~common/shared-kernel/identifiers/counsel-compress-condition.id";
import { Dayjs } from "dayjs";

export class CounselCompressConditionsInfo {
  constructor(
    public readonly id: CounselCompressConditionId,
    public readonly counselId: CounselId,
    public readonly messageCountAtLastCompression: number,
    public readonly lastMessageCompressedAt: Dayjs | null,
    public readonly createdAt: Dayjs,
    public readonly updatedAt: Dayjs,
    public readonly deletedAt: Dayjs | null,
  ) {}

  static fromDomain(counselCompressCondition: CounselCompressConditions): CounselCompressConditionsInfo {
    return new CounselCompressConditionsInfo(
      counselCompressCondition.id,
      counselCompressCondition.counselId,
      counselCompressCondition.messageCountAtLastCompression,
      counselCompressCondition.lastMessageCompressedAt,
      counselCompressCondition.createdAt,
      counselCompressCondition.updatedAt,
      counselCompressCondition.deletedAt,
    );
  }

  static fromDomainArray(counselCompressConditionList: CounselCompressConditions[]): CounselCompressConditionsInfo[] {
    return counselCompressConditionList.map((condition) => CounselCompressConditionsInfo.fromDomain(condition));
  }
}
