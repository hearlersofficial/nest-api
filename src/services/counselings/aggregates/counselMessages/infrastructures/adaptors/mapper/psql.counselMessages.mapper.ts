import { Result } from "~shared/core/domain/Result";
import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { CounselMessagesEntity } from "~shared/core/infrastructure/entities/CounselMessages.entity";
import { CounselMessages } from "~counselings/aggregates/counselMessages/domain/CounselMessages";

import { InternalServerErrorException } from "@nestjs/common";
import dayjs from "dayjs";

export class PsqlCounselMessagesMapper {
  static toDomain(entity: CounselMessagesEntity): CounselMessages | null {
    if (!entity) {
      return null;
    }

    const counselMessageProps = {
      counselId: new UniqueEntityId(entity.counselId),
      message: entity.message,
      userId: new UniqueEntityId(entity.userId),
      counselTechniqueId: new UniqueEntityId(entity.counselTechniqueId),
      isUserMessage: entity.isUserMessage,
      reactedAt: entity.reactedAt ? dayjs(entity.reactedAt) : null,
      reaction: entity.reaction ? entity.reaction : null,
      createdAt: dayjs(entity.createdAt),
      updatedAt: dayjs(entity.updatedAt),
      deletedAt: entity.deletedAt ? dayjs(entity.deletedAt) : null,
    };
    const counselMessagesOrError: Result<CounselMessages> = CounselMessages.create(counselMessageProps, new UniqueEntityId(entity.id));

    if (counselMessagesOrError.isFailure) {
      throw new InternalServerErrorException(counselMessagesOrError.errorValue);
    }

    return counselMessagesOrError.value;
  }

  static toEntity(counselMessages: CounselMessages): CounselMessagesEntity {
    const entity = new CounselMessagesEntity();

    if (!counselMessages.id.isNewIdentifier()) {
      entity.id = counselMessages.id.getString();
    }
    if (!counselMessages.counselId.isNewIdentifier()) {
      entity.counselId = counselMessages.counselId.getString();
    }

    entity.userId = counselMessages.userId.getString();
    entity.counselTechniqueId = counselMessages.counselTechniqueId.getString();

    entity.message = counselMessages.message;
    entity.isUserMessage = counselMessages.isUserMessage;

    entity.reactedAt = counselMessages.reactedAt ? counselMessages.reactedAt.toISOString() : null;
    entity.reaction = counselMessages.reaction ? counselMessages.reaction : null;

    entity.createdAt = counselMessages.createdAt.toISOString();
    entity.updatedAt = counselMessages.updatedAt.toISOString();
    entity.deletedAt = counselMessages.deletedAt ? counselMessages.deletedAt.toISOString() : null;

    return entity;
  }
}
