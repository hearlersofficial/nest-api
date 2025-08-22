import { TypeormCounselorScopedPromptsMapper } from "~counselings/domains/prompt-versions/infrastructures/mappers/typeorm-counselor-scoped-prompts.mapper";
import { TypeormToneScopedPromptsMapper } from "~counselings/domains/prompt-versions/infrastructures/mappers/typeorm-tone-scoped-prompts.mapper";
import { CounselorScopedPrompts } from "~counselings/domains/prompt-versions/models/counselor-scoped-prompts";
import { PromptVersions, PromptVersionsProps } from "~counselings/domains/prompt-versions/models/prompt-versions";
import { ToneScopedPrompts } from "~counselings/domains/prompt-versions/models/tone-scoped-prompts";

import { HttpStatus } from "@nestjs/common";
import { PromptVersionId } from "~common/shared-kernel/identifiers/prompt-version.id";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";
import { PromptVersionEntity } from "~common/system/persistences/entities/prompts/PromptVersions.entity";
import dayjs from "dayjs";

export class TypeormPromptVersionsMapper {
  static toDomain(entity: null): null;
  static toDomain(entity: PromptVersionEntity): PromptVersions;
  static toDomain(entity: PromptVersionEntity | null): PromptVersions | null;
  static toDomain(entity: PromptVersionEntity | null): PromptVersions | null {
    if (!entity) {
      return null;
    }

    const counselorScopedPrompts: CounselorScopedPrompts[] = TypeormCounselorScopedPromptsMapper.toDomains(
      entity.counselorScopedPrompts,
    );
    const toneScopedPrompts: ToneScopedPrompts[] = TypeormToneScopedPromptsMapper.toDomains(entity.toneScopedPrompts);

    const promptVersionsProps: PromptVersionsProps = {
      name: entity.name,
      description: entity.description,
      counselorScopedPrompts,
      toneScopedPrompts,
      isActive: entity.isActive,
      isTemporary: entity.isTemporary,
      isBookmarked: entity.isBookmarked,
      aiModel: entity.aiModel,
      createdAt: dayjs(entity.createdAt),
      updatedAt: dayjs(entity.updatedAt),
      deletedAt: entity.deletedAt ? dayjs(entity.deletedAt) : null,
    };
    const promptVersionsOrError = PromptVersions.create(promptVersionsProps, new PromptVersionId(entity.id));
    if (promptVersionsOrError.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, promptVersionsOrError.errorValue);
    }

    return promptVersionsOrError.value;
  }

  static toDomains(entities: PromptVersionEntity[]): PromptVersions[] {
    return (entities ?? []).map((entity) => this.toDomain(entity));
  }

  static toEntity(promptVersions: PromptVersions): PromptVersionEntity {
    const entity = new PromptVersionEntity();

    if (!promptVersions.id.isNewIdentifier()) {
      entity.id = promptVersions.id.getString();
    }

    entity.counselorScopedPrompts = TypeormCounselorScopedPromptsMapper.toEntities(
      promptVersions.counselorScopedPrompts,
    );
    entity.toneScopedPrompts = TypeormToneScopedPromptsMapper.toEntities(promptVersions.toneScopedPrompts);

    entity.name = promptVersions.name;
    entity.description = promptVersions.description;
    entity.isActive = promptVersions.isActive;
    entity.isTemporary = promptVersions.isTemporary;
    entity.isBookmarked = promptVersions.isBookmarked;
    entity.aiModel = promptVersions.aiModel;

    entity.createdAt = promptVersions.createdAt.toISOString();
    entity.updatedAt = promptVersions.updatedAt.toISOString();
    entity.deletedAt = promptVersions.deletedAt ? promptVersions.deletedAt.toISOString() : null;

    return entity;
  }

  static toEntities(promptVersions: PromptVersions[]): PromptVersionEntity[] {
    return (promptVersions ?? []).map((promptVersion) => this.toEntity(promptVersion));
  }
}
