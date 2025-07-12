import { CompressedContextCriteriaFindMany } from "~counselings/domains/compressedContext/compressedContext.criteria";
import { CompressedContextReader } from "~counselings/domains/compressedContext/compressedContext.reader";
import { CompressedContextRepository } from "~counselings/domains/compressedContext/infrastructures/compressedContext.repository";
import { RepositoryCompressedContextCriteriaMapper } from "~counselings/domains/compressedContext/infrastructures/mappers/repository-compressedContext-criteria.mapper";
import { CompressedContexts } from "~counselings/domains/compressedContext/models/compressedContext";

import { Injectable } from "@nestjs/common";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";

@Injectable()
export class RepositoryCompressedContextReader extends CompressedContextReader {
  constructor(private readonly compressedContextRepository: CompressedContextRepository) {
    super();
  }

  override async findOne(props: { compressedContextId: UniqueEntityId }): Promise<CompressedContexts | null> {
    return this.compressedContextRepository.findByCompressedContextId(props.compressedContextId);
  }

  override async findMany(props: CompressedContextCriteriaFindMany): Promise<CompressedContexts[]> {
    const typeormOptions = RepositoryCompressedContextCriteriaMapper.toFindManyOptions(props);
    return this.compressedContextRepository.findMany(typeormOptions);
  }
}
