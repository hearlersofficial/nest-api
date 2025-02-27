import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { CounselorsEntity } from "~shared/core/infrastructure/entities/Counselors.entity";
import { convertUtcStringToDayjs, formatDayjsToUtcString } from "~shared/utils/Date.utils";
import { Counselors, CounselorsProps } from "~counselings/aggregates/counselors/domain/counselors";

import { InternalServerErrorException } from "@nestjs/common";

export class PsqlCounselorsMapper {
  static toDomain(entity: CounselorsEntity): Counselors | null {
    if (!entity) {
      return null;
    }

    const counselorProps: CounselorsProps = {
      name: entity.name,
      gender: entity.gender,
      description: entity.description,
      toneId: new UniqueEntityId(entity.toneId),
      createdAt: convertUtcStringToDayjs(entity.createdAt),
      updatedAt: convertUtcStringToDayjs(entity.updatedAt),
      deletedAt: entity.deletedAt ? convertUtcStringToDayjs(entity.deletedAt) : null,
    };
    const counselorsOrError = Counselors.create(counselorProps, new UniqueEntityId(entity.id));

    if (counselorsOrError.isFailure) {
      throw new InternalServerErrorException(counselorsOrError.errorValue);
    }

    return counselorsOrError.value;
  }

  static toEntity(counselors: Counselors): CounselorsEntity {
    const entity = new CounselorsEntity();

    entity.id = counselors.id.getString();
    entity.name = counselors.name;
    entity.gender = counselors.gender;
    entity.description = counselors.description;
    entity.toneId = counselors.toneId.getString();

    entity.createdAt = formatDayjsToUtcString(counselors.createdAt);
    entity.updatedAt = formatDayjsToUtcString(counselors.updatedAt);
    entity.deletedAt = counselors.deletedAt ? formatDayjsToUtcString(counselors.deletedAt) : null;

    return entity;
  }
}
