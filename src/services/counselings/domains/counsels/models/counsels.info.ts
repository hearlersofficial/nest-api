import { CounselContextsInfo } from "~counselings/domains/counsels/models/counsel-contexts.info";
import { Counsels } from "~counselings/domains/counsels/models/counsels";

import { CounselId } from "~common/shared-kernel/identifiers/counsel.id";
import { CounselTechniqueId } from "~common/shared-kernel/identifiers/counsel-techinque.id";
import { CounselorId } from "~common/shared-kernel/identifiers/counselor.id";
import { CounselorUserRelationshipId } from "~common/shared-kernel/identifiers/counselor-user-relationship.id";
import { PromptVersionId } from "~common/shared-kernel/identifiers/prompt-version.id";
import { UserId } from "~common/shared-kernel/identifiers/user.id";
import { Dayjs } from "dayjs";

export class CounselsInfo {
  constructor(
    public readonly id: CounselId,
    public readonly userId: UserId,
    public readonly counselorId: CounselorId,
    public readonly counselTechniqueId: CounselTechniqueId,
    public readonly promptVersionId: PromptVersionId,
    public readonly counselorUserRelationshipId: CounselorUserRelationshipId,
    public readonly context: CounselContextsInfo,
    public readonly lastChatedAt: Dayjs | null,
    public readonly lastMessage: string | null,
    public readonly messageCount: number,
    public readonly notCompressedMessageCount: number,
    public readonly lastMessageCompressedAt: Dayjs | null,
    public readonly shouldCompressContext: boolean,
    public readonly createdAt: Dayjs,
    public readonly updatedAt: Dayjs,
    public readonly deletedAt: Dayjs | null,
  ) {}

  static fromDomain(counsel: Counsels): CounselsInfo {
    return new CounselsInfo(
      counsel.id,
      counsel.userId,
      counsel.counselorId,
      counsel.counselTechniqueId,
      counsel.promptVersionId,
      counsel.counselorUserRelationshipId,
      CounselContextsInfo.fromDomain(counsel.counselContexts),
      counsel.lastChatedAt,
      counsel.lastMessage,
      counsel.messageCount,
      counsel.counselContexts.notCompressedMessageCount,
      counsel.counselContexts.lastMessageCompressedAt,
      counsel.counselContexts.shouldCompressContext(),
      counsel.createdAt,
      counsel.updatedAt,
      counsel.deletedAt,
    );
  }

  static fromDomainArray(counsels: Counsels[]): CounselsInfo[] {
    return counsels.map((counsel) => CounselsInfo.fromDomain(counsel));
  }
}
