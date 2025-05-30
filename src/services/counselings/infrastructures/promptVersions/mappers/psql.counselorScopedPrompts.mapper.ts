import {
  CounselorScopedPrompts,
  CounselorScopedPromptsProps,
} from "~counselings/domains/promptVersions/models/counselorScopedPrompts";

import { HttpStatus } from "@nestjs/common";
import { UniqueEntityId } from "~common/shared-kernel/domains/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";
import { CounselorScopedPromptEntity } from "~common/system/persistences/entities/prompts/CounselorScopedPrompts.entity";
import dayjs from "dayjs";

export class PsqlCounselorScopedPromptsMapper {
  static toDomain(entity: null): null;
  static toDomain(entity: CounselorScopedPromptEntity): CounselorScopedPrompts;
  static toDomain(entity: CounselorScopedPromptEntity | null): CounselorScopedPrompts | null;
  static toDomain(entity: CounselorScopedPromptEntity | null): CounselorScopedPrompts | null {
    if (!entity) {
      return null;
    }

    const counselorScopedPromptsProps: CounselorScopedPromptsProps = {
      promptVersionId: new UniqueEntityId(entity.promptVersionId),
      counselorId: new UniqueEntityId(entity.counselorId),
      personaPromptId: new UniqueEntityId(entity.personaPromptId),
      createdAt: dayjs(entity.createdAt),
      updatedAt: dayjs(entity.updatedAt),
      deletedAt: entity.deletedAt ? dayjs(entity.deletedAt) : null,
    };

    const counselorScopedPromptOrError = CounselorScopedPrompts.create(
      counselorScopedPromptsProps,
      new UniqueEntityId(entity.id),
    );

    if (counselorScopedPromptOrError.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, counselorScopedPromptOrError.errorValue);
    }

    return counselorScopedPromptOrError.value;
  }

  static toDomains(entities: CounselorScopedPromptEntity[]): CounselorScopedPrompts[] {
    return (entities ?? []).map((entity) => this.toDomain(entity));
  }

  static toEntity(counselorScopedPrompt: CounselorScopedPrompts): CounselorScopedPromptEntity {
    const entity = new CounselorScopedPromptEntity();

    if (!counselorScopedPrompt.id.isNewIdentifier()) {
      entity.id = counselorScopedPrompt.id.getString();
    }

    entity.promptVersionId = counselorScopedPrompt.promptVersionId.getString();
    entity.counselorId = counselorScopedPrompt.counselorId.getString();
    entity.personaPromptId = counselorScopedPrompt.personaPromptId.getString();

    entity.createdAt = counselorScopedPrompt.createdAt.toISOString();
    entity.updatedAt = counselorScopedPrompt.updatedAt.toISOString();
    entity.deletedAt = counselorScopedPrompt.deletedAt ? counselorScopedPrompt.deletedAt.toISOString() : null;

    return entity;
  }

  static toEntities(promptByCounselors: CounselorScopedPrompts[]): CounselorScopedPromptEntity[] {
    return (promptByCounselors ?? []).map((prompt) => this.toEntity(prompt));
  }
}
