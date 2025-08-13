import {
  CounselorScopedPrompts,
  CounselorScopedPromptsProps,
} from "~counselings/domains/promptVersions/models/counselorScopedPrompts";

import { HttpStatus } from "@nestjs/common";
import { CounselorId } from "~common/shared-kernel/identifiers/counselor.id";
import { CounselorScopedPromptId } from "~common/shared-kernel/identifiers/counselor-scoped-prompt.id";
import { PersonaPromptId } from "~common/shared-kernel/identifiers/persona-prompt.id";
import { PromptVersionId } from "~common/shared-kernel/identifiers/prompt-version.id";
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
      promptVersionId: new PromptVersionId(entity.promptVersionId),
      counselorId: new CounselorId(entity.counselorId),
      personaPromptId: new PersonaPromptId(entity.personaPromptId),
      createdAt: dayjs(entity.createdAt),
      updatedAt: dayjs(entity.updatedAt),
      deletedAt: entity.deletedAt ? dayjs(entity.deletedAt) : null,
    };

    const counselorScopedPromptOrError = CounselorScopedPrompts.create(
      counselorScopedPromptsProps,
      new CounselorScopedPromptId(entity.id),
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
