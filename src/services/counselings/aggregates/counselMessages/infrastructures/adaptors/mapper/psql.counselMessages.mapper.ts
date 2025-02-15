import { Result } from "~shared/core/domain/Result";
import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { CounselMessagesEntity } from "~shared/core/infrastructure/entities/CounselMessages.entity";
import { convertUtcStringToDayjs, formatDayjsToUtcString } from "~shared/utils/Date.utils";
import { CounselMessages } from "~counselings/aggregates/counselMessages/domain/CounselMessages";

import { InternalServerErrorException } from "@nestjs/common";

export class PsqlCounselMessagesMapper {
  static toDomain(entity: CounselMessagesEntity): CounselMessages | null {
    if (!entity) {
      return null;
    }

    const counselMessageProps = {
      counselId: new UniqueEntityId(entity.counselId),
      message: entity.message,
      userId: new UniqueEntityId(entity.userId),
      isUserMessage: entity.isUserMessage,
      reactedAt: entity.reactedAt ? convertUtcStringToDayjs(entity.reactedAt) : null,
      reaction: entity.reaction ? entity.reaction : null,
      createdAt: convertUtcStringToDayjs(entity.createdAt),
      updatedAt: convertUtcStringToDayjs(entity.updatedAt),
      deletedAt: entity.deletedAt ? convertUtcStringToDayjs(entity.deletedAt) : null,
    };
    const counselMessagesOrError: Result<CounselMessages> = CounselMessages.create(
      counselMessageProps,
      new UniqueEntityId(entity.id),
    );

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

    entity.message = counselMessages.message;
    entity.isUserMessage = counselMessages.isUserMessage;

    entity.reactedAt = counselMessages.reactedAt ? formatDayjsToUtcString(counselMessages.reactedAt) : null;
    entity.reaction = counselMessages.reaction ? counselMessages.reaction : null;

    entity.createdAt = formatDayjsToUtcString(counselMessages.createdAt);
    entity.updatedAt = formatDayjsToUtcString(counselMessages.updatedAt);
    entity.deletedAt = counselMessages.deletedAt ? formatDayjsToUtcString(counselMessages.deletedAt) : null;

    return entity;
  }
}
