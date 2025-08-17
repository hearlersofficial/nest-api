import { CompressedMessages } from "~counselings/domains/counsels/models/compressed-messages";

import { CompressedMessageId } from "~common/shared-kernel/identifiers/compressed-context.id";
import { CounselId } from "~common/shared-kernel/identifiers/counsel.id";
import { Dayjs } from "dayjs";

export class CompressedMessageInfo {
  constructor(
    public readonly id: CompressedMessageId,
    public readonly counselId: CounselId,
    public readonly content: string,
    public readonly messageCountAtCompression: number,
    public readonly createdAt: Dayjs,
    public readonly updatedAt: Dayjs,
    public readonly deletedAt: Dayjs | null,
  ) {}

  static fromDomain(compressedMessage: CompressedMessages): CompressedMessageInfo {
    return new CompressedMessageInfo(
      compressedMessage.id,
      compressedMessage.counselId,
      compressedMessage.content,
      compressedMessage.messageCountAtCompression,
      compressedMessage.createdAt,
      compressedMessage.updatedAt,
      compressedMessage.deletedAt,
    );
  }

  static fromDomainArray(compressedMessages: CompressedMessages[]): CompressedMessageInfo[] {
    return compressedMessages.map((message) => CompressedMessageInfo.fromDomain(message));
  }
}
