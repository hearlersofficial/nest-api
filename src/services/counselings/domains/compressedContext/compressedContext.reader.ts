import { CompressedContextCriteriaFindMany } from "~counselings/domains/compressedContext/compressedContext.criteria";
import { CompressedContexts } from "~counselings/domains/compressedContext/models/compressedContext";

import { Injectable } from "@nestjs/common";
import { CompressedContextId } from "~common/shared-kernel/identifiers/compressed-context.id";

@Injectable()
export abstract class CompressedContextReader {
  abstract findOne(props: { compressedContextId: CompressedContextId }): Promise<CompressedContexts | null>;
  abstract findMany(props: CompressedContextCriteriaFindMany): Promise<CompressedContexts[]>;
}
