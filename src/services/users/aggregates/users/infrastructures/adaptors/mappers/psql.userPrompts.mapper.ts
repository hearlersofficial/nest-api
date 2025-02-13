import { Result } from "~shared/core/domain/Result";
import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { UserPromptsEntity } from "~shared/core/infrastructure/entities/UserPrompts.entity";
import { toDomainConversation, toEntityConversation } from "~shared/types/prompts.types";
import { convertDayjs, formatDayjs } from "~shared/utils/Date.utils";
import { UserPrompts } from "~users/aggregates/users/domain/UserPrompts";

import { InternalServerErrorException } from "@nestjs/common";
<<<<<<< HEAD:src/services/users/aggregates/users/infrastructures/adaptors/mappers/psql.userPrompts.mapper.ts
=======
import { UserPrompts } from "~/src/aggregates/users/domain/UserPrompts";
import { Result } from "~/src/shared/core/domain/Result";
import { UniqueEntityId } from "~/src/shared/core/domain/UniqueEntityId";
import { UserPromptsEntity } from "~/src/shared/core/infrastructure/entities/users/UserPrompts.entity";
import { toDomainConversation, toEntityConversation } from "~/src/shared/types/prompts.types";
import { convertDayjs, formatDayjs } from "~/src/shared/utils/Date.utils";
>>>>>>> 270a161 (feat: snowflakeid 추가 새 프로덕트에 맞는 디비 구조 정립):src/aggregates/users/infrastructures/adaptors/mappers/psql.userPrompts.mapper.ts

export class PsqlUserPromptsMapper {
  static toDomain(entity: UserPromptsEntity): UserPrompts | null {
    if (!entity) {
      return null;
    }

    const userPromptsProps = {
      userId: new UniqueEntityId(entity.userId),
      templateId: new UniqueEntityId(entity.templateId),
      context: entity.context,
      generatedPrompt: entity.generatedPrompt,
      conversationHistory: entity.conversationHistory.map(toDomainConversation),
      analysis: entity.analysis,
      createdAt: convertDayjs(entity.createdAt),
      updatedAt: convertDayjs(entity.updatedAt),
      deletedAt: entity.deletedAt ? convertDayjs(entity.deletedAt) : null,
    };

    const userPromptsOrError: Result<UserPrompts> = UserPrompts.create(userPromptsProps, new UniqueEntityId(entity.id));

    if (userPromptsOrError.isFailure) {
      throw new InternalServerErrorException(userPromptsOrError.errorValue);
    }

    return userPromptsOrError.value;
  }

  static toEntity(userPrompts: UserPrompts): UserPromptsEntity {
    const entity = new UserPromptsEntity();

    if (!userPrompts.id.isNewIdentifier()) {
      entity.id = userPrompts.id.getString();
    }
    if (!userPrompts.userId.isNewIdentifier()) {
      entity.userId = userPrompts.userId.getString();
    }
    if (!userPrompts.templateId.isNewIdentifier()) {
      entity.templateId = userPrompts.templateId.getString();
    }

    entity.context = userPrompts.context;
    entity.generatedPrompt = userPrompts.generatedPrompt;
    entity.conversationHistory = userPrompts.conversationHistory.map(toEntityConversation);
    entity.analysis = userPrompts.analysis;
    entity.createdAt = formatDayjs(userPrompts.createdAt);
    entity.updatedAt = formatDayjs(userPrompts.updatedAt);
    entity.deletedAt = userPrompts.deletedAt ? formatDayjs(userPrompts.deletedAt) : null;

    return entity;
  }
}
