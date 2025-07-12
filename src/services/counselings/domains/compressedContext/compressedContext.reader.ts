import { CompressedContextCriteriaFindMany } from "~counselings/domains/compressedContext/compressedContext.criteria";
import { CompressedContexts } from "~counselings/domains/compressedContext/models/compressedContext";

import { Injectable } from "@nestjs/common";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";

@Injectable()
export abstract class CompressedContextReader {
  abstract findOne(props: { compressedContextId: UniqueEntityId }): Promise<CompressedContexts | null>;
  abstract findMany(props: CompressedContextCriteriaFindMany): Promise<CompressedContexts[]>;
}
