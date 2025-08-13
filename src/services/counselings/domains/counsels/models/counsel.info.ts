import { Counsels } from "~counselings/domains/counsels/models/counsels";

import { CounselId } from "~common/shared-kernel/identifiers/counsel.id";
import { CounselTechniqueId } from "~common/shared-kernel/identifiers/counsel-techinque.id";
import { CounselorId } from "~common/shared-kernel/identifiers/counselor.id";
import { CounselorUserRelationshipId } from "~common/shared-kernel/identifiers/counselor-user-relationship.id";
import { PromptVersionId } from "~common/shared-kernel/identifiers/prompt-version.id";
import { UserId } from "~common/shared-kernel/identifiers/user.id";
import { Dayjs } from "dayjs";

export class CounselInfo {
  constructor(
    public readonly id: CounselId,
    public readonly userId: UserId,
    public readonly counselorId: CounselorId,
    public readonly counselTechniqueId: CounselTechniqueId,
    public readonly promptVersionId: PromptVersionId,
    public readonly counselorUserRelationshipId: CounselorUserRelationshipId,
    public readonly lastChatedAt: Dayjs | null,
    public readonly lastMessage: string | null,
    public readonly messageCount: number,
    public readonly notCompressedMessageCount: number,
    public readonly lastContextCompressedAt: Dayjs | null,
    public readonly compressedContextExists: boolean,
    public readonly shouldCompressContext: boolean,
    public readonly createdAt: Dayjs,
    public readonly updatedAt: Dayjs,
    public readonly deletedAt: Dayjs | null,
  ) {}

  static fromDomain(counsel: Counsels): CounselInfo {
    return new CounselInfo(
      counsel.id,
      counsel.userId,
      counsel.counselorId,
      counsel.counselTechniqueId,
      counsel.promptVersionId,
      counsel.counselorUserRelationshipId,
      counsel.lastChatedAt,
      counsel.lastMessage,
      counsel.messageCount,
      counsel.notCompressedMessageCount,
      counsel.lastContextCompressedAt,
      counsel.compressedContextExists,
      counsel.shouldCompressContext(),
      counsel.createdAt,
      counsel.updatedAt,
      counsel.deletedAt,
    );
  }

  static fromDomainArray(counsels: Counsels[]): CounselInfo[] {
    return counsels.map((counsel) => CounselInfo.fromDomain(counsel));
  }
}
