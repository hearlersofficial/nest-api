import { CounselCompressConditions } from "~counselings/domains/counsels/models/counsel-compress-conditions";

import { convertDayjs } from "~common/shared/utils/date";
import { CounselId } from "~common/shared-kernel/identifiers/counsel.id";
import { CounselCompressConditionId } from "~common/shared-kernel/identifiers/counsel-compress-condition.id";
import { CounselCompressConditionsEntity } from "~common/system/persistences/entities/counsels/counsel-compress-conditions.entity";

export class TypeormCounselCompressConditionsMapper {
  static toDomain(entity: CounselCompressConditionsEntity): CounselCompressConditions {
    const result = CounselCompressConditions.create(
      {
        counselId: new CounselId(entity.counselId),
        messageCountAtLastCompression: entity.messageCountAtLastCompression,
        lastMessageCompressedAt: entity.lastMessageCompressedAt ? convertDayjs(entity.lastMessageCompressedAt) : null,
        createdAt: convertDayjs(entity.createdAt),
        updatedAt: convertDayjs(entity.updatedAt),
        deletedAt: entity.deletedAt ? convertDayjs(entity.deletedAt) : null,
      },
      new CounselCompressConditionId(entity.id),
    );

    if (result.isFailure) {
      throw new Error(`Failed to create CounselCompressConditions domain: ${result.error}`);
    }

    return result.value;
  }

  static toEntity(domain: CounselCompressConditions): CounselCompressConditionsEntity {
    const entity = new CounselCompressConditionsEntity();
    entity.id = domain.id.getString();
    entity.counselId = domain.counselId.getString();
    entity.messageCountAtLastCompression = domain.messageCountAtLastCompression;
    entity.lastMessageCompressedAt = domain.lastMessageCompressedAt?.toISOString() || null;
    entity.createdAt = domain.createdAt.toISOString();
    entity.updatedAt = domain.updatedAt.toISOString();
    entity.deletedAt = domain.deletedAt ? domain.deletedAt.toISOString() : null;
    return entity;
  }
}
