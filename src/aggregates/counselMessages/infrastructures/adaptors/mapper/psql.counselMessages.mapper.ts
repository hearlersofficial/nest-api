import { InternalServerErrorException } from "@nestjs/common";
import { Result } from "~/src/shared/core/domain/Result";
import { UniqueEntityId } from "~/src/shared/core/domain/UniqueEntityId";
import { convertDayjs, formatDayjs } from "~/src/shared/utils/Date.utils";
import { CounselMessages } from "~/src/aggregates/counselMessages/domain/CounselMessages";
import { CounselMessagesEntity } from "~/src/shared/core/infrastructure/entities/CounselMessages.entity";

export class PsqlCounselMessagesMapper {
  static toDomain(entity: CounselMessagesEntity): CounselMessages | null {
    if (!entity) {
      return null;
    }

    const counselMessageProps = {
      counselId: new UniqueEntityId(entity.counselId),
      message: entity.message,
      isUserMessage: entity.isUserMessage,
      reactedAt: entity.reactedAt ? convertDayjs(entity.reactedAt) : null,
      reaction: entity.reaction ? entity.reaction : null,
      createdAt: convertDayjs(entity.createdAt),
      updatedAt: convertDayjs(entity.updatedAt),
      deletedAt: entity.deletedAt ? convertDayjs(entity.deletedAt) : null,
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
      entity.id = counselMessages.id.getNumber();
    }
    if (!counselMessages.counselId.isNewIdentifier()) {
      entity.counselId = counselMessages.counselId.getNumber();
    }

    entity.message = counselMessages.message;
    entity.isUserMessage = counselMessages.isUserMessage;

    entity.reactedAt = counselMessages.reactedAt ? formatDayjs(counselMessages.reactedAt) : null;
    entity.reaction = counselMessages.reaction ? counselMessages.reaction : null;

    entity.createdAt = formatDayjs(counselMessages.createdAt);
    entity.updatedAt = formatDayjs(counselMessages.updatedAt);
    entity.deletedAt = counselMessages.deletedAt ? formatDayjs(counselMessages.deletedAt) : null;

    return entity;
  }
}
