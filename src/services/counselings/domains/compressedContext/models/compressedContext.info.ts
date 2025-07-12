import { CompressedContexts } from "~counselings/domains/compressedContext/models/compressedContext";

import { Dayjs } from "dayjs";

export class CompressedContextInfo {
  constructor(
    public readonly id: string,
    public readonly counselId: string,
    public readonly content: string,
    public readonly messageCountAtCompression: number,
    public readonly createdAt: Dayjs,
    public readonly updatedAt: Dayjs,
    public readonly deletedAt: Dayjs | null,
  ) {}

  static fromDomain(compressedContext: CompressedContexts): CompressedContextInfo {
    return new CompressedContextInfo(
      compressedContext.id.getString(),
      compressedContext.counselId.getString(),
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
