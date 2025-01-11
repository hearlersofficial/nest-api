import { UniqueEntityId } from "~/src/shared/core/domain/UniqueEntityId";
import { CounselorsEntity } from "~/src/shared/core/infrastructure/entities/Counselor.entity";
import { convertDayjs, formatDayjs } from "~/src/shared/utils/Date.utils";
import { Counselors } from "~counselings/aggregates/counselors/domain/counselors";

import { InternalServerErrorException } from "@nestjs/common";

export class PsqlCounselorsMapper {
  static toDomain(entity: CounselorsEntity): Counselors | null {
    if (!entity) {
      return null;
    }

    const counselorProps = {
      counselorType: entity.counselorType,
      name: entity.name,
      gender: entity.gender,
      description: entity.description,
      introMessage: null,
      responseOption1: null,
      responseOption2: null,
      createdAt: convertDayjs(entity.createdAt),
      updatedAt: convertDayjs(entity.updatedAt),
      deletedAt: entity.deletedAt ? convertDayjs(entity.deletedAt) : null,
    };
    const counselorsOrError = Counselors.create(counselorProps, new UniqueEntityId(entity.id));

    if (counselorsOrError.isFailure) {
      throw new InternalServerErrorException(counselorsOrError.errorValue);
    }

    return counselorsOrError.value;
  }

  static toEntity(counselors: Counselors): CounselorsEntity {
    const entity = new CounselorsEntity();

    if (!counselors.id.isNewIdentifier()) {
      entity.id = counselors.id.getNumber();
    }

    entity.counselorType = counselors.counselorType;
    entity.name = counselors.name;
    entity.gender = counselors.gender;
    entity.description = counselors.description;

    entity.createdAt = formatDayjs(counselors.createdAt);
    entity.updatedAt = formatDayjs(counselors.updatedAt);
    entity.deletedAt = counselors.deletedAt ? formatDayjs(counselors.deletedAt) : null;

    return entity;
  }
}
