import {
  ToneScopedPrompts,
  ToneScopedPromptsProps,
} from "~counselings/domains/prompt-versions/models/tone-scoped-prompts";

import { HttpStatus } from "@nestjs/common";
import { CounselTechniqueId } from "~common/shared-kernel/identifiers/counsel-techinque.id";
import { PromptVersionId } from "~common/shared-kernel/identifiers/prompt-version.id";
import { ToneId } from "~common/shared-kernel/identifiers/tone.id";
import { TonePromptId } from "~common/shared-kernel/identifiers/tone-prompt.id";
import { ToneScopedPromptId } from "~common/shared-kernel/identifiers/tone-scoped-prompt.id";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";
import { ToneScopedPromptEntity } from "~common/system/persistences/entities/prompts/tone-scoped-prompts.entity";
import dayjs from "dayjs";

export class TypeormToneScopedPromptsMapper {
  static toDomain(entity: null): null;
  static toDomain(entity: ToneScopedPromptEntity): ToneScopedPrompts;
  static toDomain(entity: ToneScopedPromptEntity | null): ToneScopedPrompts | null;
  static toDomain(entity: ToneScopedPromptEntity | null): ToneScopedPrompts | null {
    if (!entity) {
      return null;
    }

    const toneScopedPromptProps: ToneScopedPromptsProps = {
      promptVersionId: new PromptVersionId(entity.promptVersionId),
      toneId: new ToneId(entity.toneId),
      tonePromptId: entity.tonePromptId ? new TonePromptId(entity.tonePromptId) : null,
      firstCounselTechniqueId: entity.firstCounselTechniqueId
        ? new CounselTechniqueId(entity.firstCounselTechniqueId)
        : null,
      createdAt: dayjs(entity.createdAt),
      updatedAt: dayjs(entity.updatedAt),
      deletedAt: entity.deletedAt ? dayjs(entity.deletedAt) : null,
    };

    const toneScopedPromptOrError = ToneScopedPrompts.create(toneScopedPromptProps, new ToneScopedPromptId(entity.id));

    if (toneScopedPromptOrError.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, toneScopedPromptOrError.errorValue);
    }

    return toneScopedPromptOrError.value;
  }

  static toDomains(entities: ToneScopedPromptEntity[]): ToneScopedPrompts[] {
    return (entities ?? []).map((entity) => this.toDomain(entity));
  }

  static toEntity(promptByTones: ToneScopedPrompts): ToneScopedPromptEntity {
    const entity = new ToneScopedPromptEntity();

    if (!promptByTones.id.isNewIdentifier()) {
      entity.id = promptByTones.id.getString();
    }

    entity.promptVersionId = promptByTones.promptVersionId.getString();
    entity.toneId = promptByTones.toneId.getString();
    entity.tonePromptId = promptByTones.tonePromptId ? promptByTones.tonePromptId.getString() : null;
    entity.firstCounselTechniqueId = promptByTones.firstCounselTechniqueId
      ? promptByTones.firstCounselTechniqueId.getString()
      : null;

    entity.createdAt = promptByTones.createdAt.toISOString();
    entity.updatedAt = promptByTones.updatedAt.toISOString();
    entity.deletedAt = promptByTones.deletedAt ? promptByTones.deletedAt.toISOString() : null;

    return entity;
  }

  static toEntities(promptByTones: ToneScopedPrompts[]): ToneScopedPromptEntity[] {
    return (promptByTones ?? []).map((prompt) => this.toEntity(prompt));
  }
}
