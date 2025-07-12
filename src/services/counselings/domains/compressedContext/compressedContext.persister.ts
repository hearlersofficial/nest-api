import {
  CompressedContextNewProps,
  CompressedContexts,
} from "~counselings/domains/compressedContext/models/compressedContext";

import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class CompressedContextPersister {
  abstract create(newProps: CompressedContextNewProps): Promise<CompressedContexts>;
  abstract update(compressedContext: CompressedContexts): Promise<CompressedContexts>;
  abstract updateMany(compressedContexts: CompressedContexts[]): Promise<CompressedContexts[]>;
}
