import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { CounselMessagesEntity } from "~shared/core/infrastructure/entities/counsels/CounselMessages.entity";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import {
  CounselMessages,
  CounselMessagesProps,
} from "~counselings/domains/counselMessages/models/counselMessages";

import { HttpStatus } from "@nestjs/common";
import dayjs from "dayjs";

export class PsqlCounselMessagesMapper {
  static toDomain(entity: null): null;
  static toDomain(entity: CounselMessagesEntity): CounselMessages;
  static toDomain(entity: CounselMessagesEntity | null): CounselMessages | null;
  static toDomain(
    entity: CounselMessagesEntity | null
  ): CounselMessages | null {
    if (!entity) {
      return null;
    }

    const counselMessageProps: CounselMessagesProps = {
      userId: new UniqueEntityId(entity.userId),
      counselId: new UniqueEntityId(entity.counselId),
      counselTechniqueId: new UniqueEntityId(entity.counselTechniqueId),
      message: entity.message,
      isUserMessage: entity.isUserMessage,

      reactedAt: entity.reactedAt ? dayjs(entity.reactedAt) : null,
      reaction: entity.reaction,

      createdAt: dayjs(entity.createdAt),
      updatedAt: dayjs(entity.updatedAt),
      deletedAt: entity.deletedAt ? dayjs(entity.deletedAt) : null,
    };
    const counselMessagesOrError = CounselMessages.create(
      counselMessageProps,
      new UniqueEntityId(entity.id)
    );

    if (counselMessagesOrError.isFailure) {
      throw new HttpStatusBasedRpcException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        counselMessagesOrError.errorValue
      );
    }

    return counselMessagesOrError.value;
  }

  static toDomains(entities: CounselMessagesEntity[]): CounselMessages[] {
    return (entities ?? []).map((entity) => this.toDomain(entity));
  }

  static toEntity(counselMessages: CounselMessages): CounselMessagesEntity {
    const entity = new CounselMessagesEntity();

    entity.id = counselMessages.id.getString();
    entity.userId = counselMessages.userId.getString();
    entity.counselId = counselMessages.counselId.getString();
    entity.counselTechniqueId = counselMessages.counselTechniqueId.getString();
    entity.message = counselMessages.message;
    entity.isUserMessage = counselMessages.isUserMessage;
    entity.reactedAt = counselMessages.reactedAt
      ? counselMessages.reactedAt.toISOString()
      : null;
    entity.reaction = counselMessages.reaction;
    entity.createdAt = counselMessages.createdAt.toISOString();
    entity.updatedAt = counselMessages.updatedAt.toISOString();
    entity.deletedAt = counselMessages.deletedAt
      ? counselMessages.deletedAt.toISOString()
      : null;

    return entity;
  }

  static toEntities(
    counselMessages: CounselMessages[]
  ): CounselMessagesEntity[] {
    return (counselMessages ?? []).map((counselMessage) =>
      this.toEntity(counselMessage)
    );
  }
}
