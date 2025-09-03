import { CounselMessages } from "~counselings/domains/counsels/models/counsel-messages";
import { CounselMessageReaction } from "~proto/com/hearlers/v1/model/counsel_pb";

import { CounselId } from "~common/shared-kernel/identifiers/counsel.id";
import { CounselMessageId } from "~common/shared-kernel/identifiers/counsel-message.id";
import { CounselTechniqueId } from "~common/shared-kernel/identifiers/counsel-techinque.id";
import { UserId } from "~common/shared-kernel/identifiers/user.id";
import { Dayjs } from "dayjs";

export class CounselMessagesInfo {
  constructor(
    public readonly id: CounselMessageId,
    public readonly counselId: CounselId,
    public readonly userId: UserId,
    public readonly counselTechniqueId: CounselTechniqueId,
    public readonly message: string,
    public readonly isUserMessage: boolean,
    public readonly reactedAt: Dayjs | null,
    public readonly reaction: CounselMessageReaction | null,
    public readonly createdAt: Dayjs,
    public readonly updatedAt: Dayjs,
    public readonly deletedAt: Dayjs | null,
  ) {}

  static fromDomain(counselMessage: CounselMessages): CounselMessagesInfo {
    return new CounselMessagesInfo(
      counselMessage.id,
      counselMessage.counselId,
      counselMessage.userId,
      counselMessage.counselTechniqueId,
      counselMessage.message,
      counselMessage.isUserMessage,
      counselMessage.reactedAt,
      counselMessage.reaction,
      counselMessage.createdAt,
      counselMessage.updatedAt,
      counselMessage.deletedAt,
    );
  }

  static fromDomainArray(counselMessages: CounselMessages[]): CounselMessagesInfo[] {
    return counselMessages.map((message) => CounselMessagesInfo.fromDomain(message));
  }
}
