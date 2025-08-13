import { Counsels } from "~counselings/domains/counsels/models/counsels";

import { CounselId } from "~common/shared-kernel/identifiers/counsel.id";
import { UserId } from "~common/shared-kernel/identifiers/user.id";
import { Dayjs } from "dayjs";

export class CounselInfo {
  constructor(
    public readonly id: CounselId,
    public readonly userId: UserId,
    public readonly counselorId: string,
    public readonly counselTechniqueId: string,
    public readonly promptVersionId: string,
    public readonly counselorUserRelationshipId: string,
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
      counsel.counselorId.getString(),
      counsel.counselTechniqueId.getString(),
      counsel.promptVersionId.getString(),
      counsel.counselorUserRelationshipId.getString(),
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
