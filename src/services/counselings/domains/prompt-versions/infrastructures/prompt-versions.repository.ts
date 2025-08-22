import { PromptVersions } from "~counselings/domains/prompt-versions/models/prompt-versions";

import { Injectable } from "@nestjs/common";
import { PromptVersionId } from "~common/shared-kernel/identifiers/prompt-version.id";
import { PromptVersionEntity } from "~common/system/persistences/entities/prompts/prompt-versions.entity";
import { FindManyOptions, FindOneOptions } from "typeorm";

@Injectable()
export abstract class PromptVersionsRepository {
  abstract findByPromptVersionId(
    promptVersionId: PromptVersionId,
    options?: FindOneOptions<PromptVersionEntity>,
  ): Promise<PromptVersions | null>;
  abstract findMany(options?: FindManyOptions<PromptVersionEntity>): Promise<PromptVersions[]>;
  abstract save(promptVersion: PromptVersions): Promise<PromptVersions>;
  abstract save(promptVersions: PromptVersions[]): Promise<PromptVersions[]>;
}
