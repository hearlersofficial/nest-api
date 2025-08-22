import { TonePrompts, TonePromptsProps } from "~counselings/domains/tone-prompts/models/tone-prompts";

import { HttpStatus } from "@nestjs/common";
import { EntityData } from "~common/shared/utils/orm";
import { PromptVersionId } from "~common/shared-kernel/identifiers/prompt-version.id";
import { ToneId } from "~common/shared-kernel/identifiers/tone.id";
import { TonePromptId } from "~common/shared-kernel/identifiers/tone-prompt.id";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";
import { TonePromptEntity } from "~common/system/persistences/entities/prompts/tone-prompts.entity";
import dayjs from "dayjs";

export class TypeormTonePromptsMapper {
  static toDomain(entity: null): null;
  static toDomain(entity: TonePromptEntity): TonePrompts;
  static toDomain(entity: TonePromptEntity | null): TonePrompts | null;
  static toDomain(entity: TonePromptEntity | null): TonePrompts | null {
    if (!entity) {
      return null;
    }
    const tonePromptProps: TonePromptsProps = {
      promptVersionId: new PromptVersionId(entity.promptVersionId),
      toneId: new ToneId(entity.toneId),
      body: entity.body,
      createdAt: dayjs(entity.createdAt),
      updatedAt: dayjs(entity.updatedAt),
      deletedAt: entity.deletedAt ? dayjs(entity.deletedAt) : null,
    };
    const tonePromptsOrError = TonePrompts.create(tonePromptProps, new TonePromptId(entity.id));
    if (tonePromptsOrError.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, tonePromptsOrError.errorValue);
    }
    return tonePromptsOrError.value;
  }

  static toDomains(entities: TonePromptEntity[]): TonePrompts[] {
    return (entities ?? []).map((entity) => this.toDomain(entity));
  }

  static toEntity(tonePrompts: TonePrompts): TonePromptEntity {
    const entity = new TonePromptEntity();

    const mappedFields: EntityData<TonePromptEntity, "tone" | "promptVersion"> = {
      id: tonePrompts.id.getString(),
      promptVersionId: tonePrompts.promptVersionId.getString(),
      toneId: tonePrompts.toneId.getString(),
      body: tonePrompts.body,
      createdAt: tonePrompts.createdAt.toISOString(),
      updatedAt: tonePrompts.updatedAt.toISOString(),
      deletedAt: tonePrompts.deletedAt ? tonePrompts.deletedAt.toISOString() : null,
    };

    Object.assign(entity, mappedFields);

    return entity;
  }

  static toEntities(tonePrompts: TonePrompts[]): TonePromptEntity[] {
    return (tonePrompts ?? []).map((prompt) => this.toEntity(prompt));
  }
}
