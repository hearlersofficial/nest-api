import { PromptVersions } from "~counselings/domains/promptVersions/models/promptVersions";

import { Injectable } from "@nestjs/common";
import { UniqueEntityId } from "~common/shared-kernel/domains/UniqueEntityId";
import { PromptVersionEntity } from "~common/system/persistences/entities/prompts/PromptVersions.entity";
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
