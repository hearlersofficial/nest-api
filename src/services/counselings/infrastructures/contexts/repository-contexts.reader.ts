import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { ContextsCriteriaFindMany } from "~counselings/domains/contexts/contexts.criteria";
import { ContextsReader } from "~counselings/domains/contexts/contexts.reader";
import { Contexts } from "~counselings/domains/contexts/models/contexts";
import { ContextsRepository } from "~counselings/infrastructures/contexts/contexts.repository";
import { RepositoryContextCriteriaMapper } from "~counselings/infrastructures/contexts/mappers/repository-contexts-criteria.mapper";

import { Injectable } from "@nestjs/common";

@Injectable()
export class RepositoryContextsReader extends ContextsReader {
  constructor(private readonly contextsRepository: ContextsRepository) {
    super();
  }

  override async findOne(props: { contextId: UniqueEntityId }): Promise<Contexts | null> {
    return this.contextsRepository.findByContextId(props.contextId);
  }

  override async findMany(props: ContextsCriteriaFindMany): Promise<Contexts[]> {
    const typeormOptions = RepositoryContextCriteriaMapper.toFindManyOptions(props);
    return this.contextsRepository.findMany(typeormOptions);
  }
}
