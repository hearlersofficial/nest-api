import { TypeormCounselContextsMapper } from "~counselings/domains/counsels/infrastructures/mappers/typeorm-counsel-contexts.mapper";
import { Counsels, CounselsProps } from "~counselings/domains/counsels/models/counsels";

import { HttpStatus } from "@nestjs/common";
import { CounselId } from "~common/shared-kernel/identifiers/counsel.id";
import { CounselTechniqueId } from "~common/shared-kernel/identifiers/counsel-techinque.id";
import { CounselorId } from "~common/shared-kernel/identifiers/counselor.id";
import { CounselorUserRelationshipId } from "~common/shared-kernel/identifiers/counselor-user-relationship.id";
import { PromptVersionId } from "~common/shared-kernel/identifiers/prompt-version.id";
import { UserId } from "~common/shared-kernel/identifiers/user.id";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";
import { CounselsEntity } from "~common/system/persistences/entities/counsels/Counsels.entity";
import dayjs from "dayjs";

export class TypeormCounselsMapper {
  static toDomain(entity: null): null;
  static toDomain(entity: CounselsEntity): Counsels;
  static toDomain(entity: CounselsEntity | null): Counsels | null;
  static toDomain(entity: CounselsEntity | null): Counsels | null {
    if (!entity) {
      return null;
    }

    const counselProps: CounselsProps = {
      userId: new UserId(entity.userId),
      counselorId: new CounselorId(entity.counselorId),
      counselTechniqueId: new CounselTechniqueId(entity.counselTechniqueId),
      promptVersionId: new PromptVersionId(entity.promptVersionId),
      counselorUserRelationshipId: new CounselorUserRelationshipId(entity.counselorUserRelationshipId),
      lastChatedAt: entity.lastChatedAt ? dayjs(entity.lastChatedAt) : null,
      lastMessage: entity.lastMessage,
      messageCount: entity.messageCount,
      notCompressedMessageCount: entity.notCompressedMessageCount,
      lastContextCompressedAt: entity.lastContextCompressedAt ? dayjs(entity.lastContextCompressedAt) : null,
      compressedContextExists: entity.compressedContextExists,
      createdAt: dayjs(entity.createdAt),
      updatedAt: dayjs(entity.updatedAt),
      deletedAt: entity.deletedAt ? dayjs(entity.deletedAt) : null,
      counselContexts: TypeormCounselContextsMapper.toDomain(entity.counselContext),
    };
    const counselsOrError = Counsels.create(counselProps, new CounselId(entity.id));

    if (counselsOrError.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, counselsOrError.errorValue);
    }

    return counselsOrError.value;
  }

  static toDomains(entities: CounselsEntity[]): Counsels[] {
    return (entities ?? []).map((entity) => this.toDomain(entity));
  }

  static toEntity(counsels: Counsels): CounselsEntity {
    const entity = new CounselsEntity();

    entity.id = counsels.id.getString();
    entity.userId = counsels.userId.getString();
    entity.counselorId = counsels.counselorId.getString();
    entity.counselTechniqueId = counsels.counselTechniqueId.getString();
    entity.promptVersionId = counsels.promptVersionId.getString();
    entity.counselorUserRelationshipId = counsels.counselorUserRelationshipId.getString();

    entity.lastChatedAt = counsels.lastChatedAt ? counsels.lastChatedAt.toISOString() : null;
    entity.lastMessage = counsels.lastMessage;

    entity.messageCount = counsels.messageCount;
    entity.notCompressedMessageCount = counsels.notCompressedMessageCount;
    entity.lastContextCompressedAt = counsels.lastContextCompressedAt
      ? counsels.lastContextCompressedAt.toISOString()
      : null;
    entity.compressedContextExists = counsels.compressedContextExists;

    entity.createdAt = counsels.createdAt.toISOString();
    entity.updatedAt = counsels.updatedAt.toISOString();
    entity.deletedAt = counsels.deletedAt ? counsels.deletedAt.toISOString() : null;

    entity.counselContext = TypeormCounselContextsMapper.toEntity(counsels.counselContexts);

    return entity;
  }

  static toEntities(counsels: Counsels[]): CounselsEntity[] {
    return (counsels ?? []).map((counsel) => this.toEntity(counsel));
  }
}
