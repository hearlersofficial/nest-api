import { CounselMessages } from "~counselings/domains/counselMessages/models/counselMessages";

import { Dayjs } from "dayjs";

export class CounselMessageInfo {
  constructor(
    public readonly id: string,
    public readonly counselId: string,
    public readonly userId: string,
    public readonly counselTechniqueId: string,
    public readonly message: string,
    public readonly isUserMessage: boolean,
    public readonly createdAt: Dayjs,
    public readonly updatedAt: Dayjs,
    public readonly deletedAt: Dayjs | null,
  ) {}

  static fromDomain(counselMessage: CounselMessages): CounselMessageInfo {
    return new CounselMessageInfo(
      counselMessage.id.getString(),
      counselMessage.counselId.getString(),
      counselMessage.userId.getString(),
      counselMessage.counselTechniqueId.getString(),
      counselMessage.message,
      counselMessage.isUserMessage,
      counselMessage.createdAt,
      counselMessage.updatedAt,
      counselMessage.deletedAt,
    );
  }

  static fromDomainArray(counselMessages: CounselMessages[]): CounselMessageInfo[] {
    return counselMessages.map((message) => CounselMessageInfo.fromDomain(message));
  }
}
