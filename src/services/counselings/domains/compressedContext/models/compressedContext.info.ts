import { CompressedContexts } from "~counselings/domains/compressedContext/models/compressedContext";

import { CompressedContextId } from "~common/shared-kernel/identifiers/compressed-context.id";
import { CounselId } from "~common/shared-kernel/identifiers/counsel.id";
import { Dayjs } from "dayjs";

export class CompressedContextInfo {
  constructor(
    public readonly id: CompressedContextId,
    public readonly counselId: CounselId,
    public readonly content: string,
    public readonly messageCountAtCompression: number,
    public readonly createdAt: Dayjs,
    public readonly updatedAt: Dayjs,
    public readonly deletedAt: Dayjs | null,
  ) {}

  static fromDomain(compressedContext: CompressedContexts): CompressedContextInfo {
    return new CompressedContextInfo(
      compressedContext.id,
      compressedContext.counselId,
      compressedContext.content,
      compressedContext.messageCountAtCompression,
      compressedContext.createdAt,
      compressedContext.updatedAt,
      compressedContext.deletedAt,
    );
  }

  static fromDomainArray(compressedContexts: CompressedContexts[]): CompressedContextInfo[] {
    return compressedContexts.map((context) => CompressedContextInfo.fromDomain(context));
  }
}
