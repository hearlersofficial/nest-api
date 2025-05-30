import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { PromptVersionEntity } from "~shared/core/infrastructure/entities/prompts/PromptVersions.entity";
import { PromptVersions } from "~counselings/domains/promptVersions/models/promptVersions";

import { Injectable } from "@nestjs/common";
import { FindManyOptions, FindOneOptions } from "typeorm";

@Injectable()
export abstract class PromptVersionsRepository {
  abstract findByPromptVersionId(
    promptVersionId: UniqueEntityId,
    options?: FindOneOptions<PromptVersionEntity>,
  ): Promise<PromptVersions | null>;
  abstract findMany(options?: FindManyOptions<PromptVersionEntity>): Promise<PromptVersions[]>;
  abstract save(promptVersion: PromptVersions): Promise<PromptVersions>;
  abstract save(promptVersions: PromptVersions[]): Promise<PromptVersions[]>;
}
