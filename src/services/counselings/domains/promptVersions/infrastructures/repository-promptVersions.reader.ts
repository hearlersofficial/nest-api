import { RepositoryPromptVersionCriteriaMapper } from "~counselings/domains/promptVersions/infrastructures/mappers/repository-promptVersions-criteria.mapper";
import { PromptVersionsRepository } from "~counselings/domains/promptVersions/infrastructures/promptVersions.repository";
import { PromptVersions } from "~counselings/domains/promptVersions/models/promptVersions";
import { PromptVersionsCriteriaFindMany } from "~counselings/domains/promptVersions/promptVersions.criteria";
import { PromptVersionsReader } from "~counselings/domains/promptVersions/promptVersions.reader";

import { Injectable } from "@nestjs/common";
import { PromptVersionId } from "~common/shared-kernel/identifiers/prompt-version.id";

@Injectable()
export class RepositoryPromptVersionsReader extends PromptVersionsReader {
  constructor(private readonly promptVersionsRepository: PromptVersionsRepository) {
    super();
  }

  override async findOne(props: {
    promptVersionId: PromptVersionId;
    withDeleted?: boolean;
  }): Promise<PromptVersions | null> {
    return this.promptVersionsRepository.findByPromptVersionId(props.promptVersionId, {
      withDeleted: props.withDeleted,
    });
  }

  override async findMany(props: PromptVersionsCriteriaFindMany): Promise<PromptVersions[]> {
    const typeormOptions = RepositoryPromptVersionCriteriaMapper.toFindManyOptions(props);
    return this.promptVersionsRepository.findMany(typeormOptions);
  }
}
