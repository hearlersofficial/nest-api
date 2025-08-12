import {
  CompressedContextProps,
  CompressedContexts,
} from "~counselings/domains/compressedContext/models/compressedContext";

import { HttpStatus } from "@nestjs/common";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";
import { CompressedContextsEntity } from "~common/system/persistences/entities/counsels/CompressedContexts.entity";
import dayjs from "dayjs";

export class PsqlCompressedContextMapper {
  static toDomain(entity: null): null;
  static toDomain(entity: CompressedContextsEntity): CompressedContexts;
  static toDomain(entity: CompressedContextsEntity | null): CompressedContexts | null {
    if (!entity) {
      return null;
    }

    const compressedContextProps: CompressedContextProps = {
      counselId: new UniqueEntityId(entity.counselId),
      content: entity.content,
      messageCountAtCompression: entity.messageCountAtCompression,
      createdAt: dayjs(entity.createdAt),
      updatedAt: dayjs(entity.updatedAt),
      deletedAt: entity.deletedAt ? dayjs(entity.deletedAt) : null,
    };
    const compressedContextOrError = CompressedContexts.create(compressedContextProps, new UniqueEntityId(entity.id));
    if (compressedContextOrError.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, compressedContextOrError.errorValue);
    }

    return compressedContextOrError.value;
  }

  static toDomains(entities: CompressedContextsEntity[]): CompressedContexts[] {
    return (entities ?? []).map((entity) => this.toDomain(entity));
  }

  static toEntity(compressedContext: CompressedContexts): CompressedContextsEntity {
    const entity = new CompressedContextsEntity();

    entity.id = compressedContext.id.getString();
    entity.counselId = compressedContext.counselId.getString();
    entity.content = compressedContext.content;
    entity.messageCountAtCompression = compressedContext.messageCountAtCompression;
    entity.createdAt = compressedContext.createdAt.toISOString();
    entity.updatedAt = compressedContext.updatedAt.toISOString();
    entity.deletedAt = compressedContext.deletedAt ? compressedContext.deletedAt.toISOString() : null;

    return entity;
  }

  static toEntities(compressedContexts: CompressedContexts[]): CompressedContextsEntity[] {
    return (compressedContexts ?? []).map((compressedContext) => this.toEntity(compressedContext));
  }
}
