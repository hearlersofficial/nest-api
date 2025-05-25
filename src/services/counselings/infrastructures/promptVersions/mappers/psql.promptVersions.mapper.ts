import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { PromptVersionEntity } from "~shared/core/infrastructure/entities/prompts/PromptVersions.entity";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { CounselorScopedPrompts } from "~counselings/domains/promptVersions/models/counselorScopedPrompts";
import {
  PromptVersions,
  PromptVersionsProps,
} from "~counselings/domains/promptVersions/models/promptVersions";
import { ToneScopedPrompts } from "~counselings/domains/promptVersions/models/toneScopedPrompts";
import { PsqlCounselorScopedPromptsMapper } from "~counselings/infrastructures/promptVersions/mappers/psql.counselorScopedPrompts.mapper";
import { PsqlToneScopedPromptsMapper } from "~counselings/infrastructures/promptVersions/mappers/psql.toneScopedPrompts.mapper";

import { HttpStatus } from "@nestjs/common";
import dayjs from "dayjs";

export class PsqlPromptVersionsMapper {
  static toDomain(entity: null): null;
  static toDomain(entity: PromptVersionEntity): PromptVersions;
  static toDomain(entity: PromptVersionEntity | null): PromptVersions | null;
  static toDomain(entity: PromptVersionEntity | null): PromptVersions | null {
    if (!entity) {
      return null;
    }

    const counselorScopedPrompts: CounselorScopedPrompts[] =
      PsqlCounselorScopedPromptsMapper.toDomains(entity.counselorScopedPrompts);
    const toneScopedPrompts: ToneScopedPrompts[] =
      PsqlToneScopedPromptsMapper.toDomains(entity.toneScopedPrompts);

    const promptVersionsProps: PromptVersionsProps = {
      name: entity.name,
      description: entity.description,
      counselorScopedPrompts,
      toneScopedPrompts,
      isActive: entity.isActive,
      isTemporary: entity.isTemporary,
      isBookmarked: entity.isBookmarked,
      createdAt: dayjs(entity.createdAt),
      updatedAt: dayjs(entity.updatedAt),
      deletedAt: entity.deletedAt ? dayjs(entity.deletedAt) : null,
    };
    const promptVersionsOrError = PromptVersions.create(
      promptVersionsProps,
      new UniqueEntityId(entity.id)
    );
    if (promptVersionsOrError.isFailure) {
      throw new HttpStatusBasedRpcException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        promptVersionsOrError.errorValue
      );
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

    entity.counselorScopedPrompts = PsqlCounselorScopedPromptsMapper.toEntities(
      promptVersions.counselorScopedPrompts
    );
    entity.toneScopedPrompts = PsqlToneScopedPromptsMapper.toEntities(
      promptVersions.toneScopedPrompts
    );

    entity.name = promptVersions.name;
    entity.description = promptVersions.description;
    entity.isActive = promptVersions.isActive;
    entity.isTemporary = promptVersions.isTemporary;
    entity.isBookmarked = promptVersions.isBookmarked;

    entity.createdAt = promptVersions.createdAt.toISOString();
    entity.updatedAt = promptVersions.updatedAt.toISOString();
    entity.deletedAt = promptVersions.deletedAt
      ? promptVersions.deletedAt.toISOString()
      : null;

    return entity;
  }

  static toEntities(promptVersions: PromptVersions[]): PromptVersionEntity[] {
    return (promptVersions ?? []).map((promptVersion) =>
      this.toEntity(promptVersion)
    );
  }
}
