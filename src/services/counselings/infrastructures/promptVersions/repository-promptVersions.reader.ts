import { PromptVersions } from "~counselings/domains/promptVersions/models/promptVersions";
import { PromptVersionsCriteriaFindMany } from "~counselings/domains/promptVersions/promptVersions.criteria";
import { PromptVersionsReader } from "~counselings/domains/promptVersions/promptVersions.reader";
import { RepositoryPromptVersionCriteriaMapper } from "~counselings/infrastructures/promptVersions/mappers/repository-promptVersions-criteria.mapper";
import { PromptVersionsRepository } from "~counselings/infrastructures/promptVersions/promptVersions.repository";

import { Injectable } from "@nestjs/common";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";

@Injectable()
export class RepositoryPromptVersionsReader extends PromptVersionsReader {
  constructor(private readonly promptVersionsRepository: PromptVersionsRepository) {
    super();
  }

  override async findOne(props: { promptVersionId: UniqueEntityId }): Promise<PromptVersions | null> {
    return this.promptVersionsRepository.findByPromptVersionId(props.promptVersionId);
  }

  override async findMany(props: PromptVersionsCriteriaFindMany): Promise<PromptVersions[]> {
    const typeormOptions = RepositoryPromptVersionCriteriaMapper.toFindManyOptions(props);
    return this.promptVersionsRepository.findMany(typeormOptions);
  }
}
