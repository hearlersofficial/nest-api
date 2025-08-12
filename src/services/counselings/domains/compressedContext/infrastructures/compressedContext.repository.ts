import { CompressedContexts } from "~counselings/domains/compressedContext/models/compressedContext";

import { Injectable } from "@nestjs/common";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";
import { CompressedContextsEntity } from "~common/system/persistences/entities/counsels/CompressedContexts.entity";
import { FindManyOptions, FindOneOptions } from "typeorm";

@Injectable()
export abstract class CompressedContextRepository {
  abstract findByCompressedContextId(
    compressedContextId: UniqueEntityId,
    options?: FindOneOptions<CompressedContextsEntity>,
  ): Promise<CompressedContexts | null>;
  abstract findMany(options?: FindManyOptions<CompressedContextsEntity>): Promise<CompressedContexts[]>;
  abstract save(compressedContext: CompressedContexts): Promise<CompressedContexts>;
  abstract save(compressedContexts: CompressedContexts[]): Promise<CompressedContexts[]>;
}
