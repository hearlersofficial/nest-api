import { CompressedMessages, CompressedMessagesProps } from "~counselings/domains/counsels/models/compressed-messages";

import { HttpStatus } from "@nestjs/common";
import { CompressedMessageId } from "~common/shared-kernel/identifiers/compressed-context.id";
import { CounselId } from "~common/shared-kernel/identifiers/counsel.id";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";
import { CompressedMessagesEntity } from "~common/system/persistences/entities/counsels/compressed-messages.entity";
import dayjs from "dayjs";

export class TypeormCompressedMessageMapper {
  static toDomain(entity: null): null;
  static toDomain(entity: CompressedMessagesEntity): CompressedMessages;
  static toDomain(entity: CompressedMessagesEntity | null): CompressedMessages | null {
    if (!entity) {
      return null;
    }

    const compressedMessageProps: CompressedMessagesProps = {
      counselId: new CounselId(entity.counselId),
      content: entity.content,
      messageCountAtCompression: entity.messageCountAtCompression,
      createdAt: dayjs(entity.createdAt),
      updatedAt: dayjs(entity.updatedAt),
      deletedAt: entity.deletedAt ? dayjs(entity.deletedAt) : null,
    };
    const compressedMessageOrError = CompressedMessages.create(
      compressedMessageProps,
      new CompressedMessageId(entity.id),
    );
    if (compressedMessageOrError.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, compressedMessageOrError.errorValue);
    }

    return compressedMessageOrError.value;
  }

  static toDomains(entities: CompressedMessagesEntity[]): CompressedMessages[] {
    return (entities ?? []).map((entity) => this.toDomain(entity));
  }

  static toEntity(compressedMessage: CompressedMessages): CompressedMessagesEntity {
    const entity = new CompressedMessagesEntity();

    entity.id = compressedMessage.id.getString();
    entity.counselId = compressedMessage.counselId.getString();
    entity.content = compressedMessage.content;
    entity.messageCountAtCompression = compressedMessage.messageCountAtCompression;
    entity.createdAt = compressedMessage.createdAt.toISOString();
    entity.updatedAt = compressedMessage.updatedAt.toISOString();
    entity.deletedAt = compressedMessage.deletedAt ? compressedMessage.deletedAt.toISOString() : null;

    return entity;
  }

  static toEntities(compressedMessages: CompressedMessages[]): CompressedMessagesEntity[] {
    return (compressedMessages ?? []).map((compressedMessage) => this.toEntity(compressedMessage));
  }
}
