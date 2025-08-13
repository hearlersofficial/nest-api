import { CompressedContexts } from "~counselings/domains/counsels/models/compressed-context";

import { Injectable } from "@nestjs/common";
import { CompressedContextId } from "~common/shared-kernel/identifiers/compressed-context.id";
import { CompressedContextsEntity } from "~common/system/persistences/entities/counsels/CompressedContexts.entity";
import { FindManyOptions, FindOneOptions } from "typeorm";

@Injectable()
export abstract class CompressedContextsRepository {
  abstract findByCompressedContextId(
    compressedContextId: CompressedContextId,
    options?: FindOneOptions<CompressedContextsEntity>,
  ): Promise<CompressedContexts | null>;
  abstract findMany(options?: FindManyOptions<CompressedContextsEntity>): Promise<CompressedContexts[]>;
  abstract save(compressedContext: CompressedContexts): Promise<CompressedContexts>;
  abstract save(compressedContexts: CompressedContexts[]): Promise<CompressedContexts[]>;
}
