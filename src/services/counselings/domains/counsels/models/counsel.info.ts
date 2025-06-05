import { Counsels } from "~counselings/domains/counsels/models/counsels";

import { Dayjs } from "dayjs";

export class CounselInfo {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly counselorId: string,
    public readonly counselTechniqueId: string,
    public readonly promptVersionId: string,
    public readonly counselorUserRelationshipId: string,
    public readonly createdAt: Dayjs,
    public readonly updatedAt: Dayjs,
    public readonly deletedAt: Dayjs | null,
  ) {}

  static fromDomain(counsel: Counsels): CounselInfo {
    return new CounselInfo(
      counsel.id.getString(),
      counsel.userId.getString(),
      counsel.counselorId.getString(),
      counsel.counselTechniqueId.getString(),
      counsel.promptVersionId.getString(),
      counsel.counselorUserRelationshipId.getString(),
      counsel.createdAt,
      counsel.updatedAt,
      counsel.deletedAt,
    );
  }

  static fromDomainArray(counsels: Counsels[]): CounselInfo[] {
    return counsels.map((counsel) => CounselInfo.fromDomain(counsel));
  }
}
