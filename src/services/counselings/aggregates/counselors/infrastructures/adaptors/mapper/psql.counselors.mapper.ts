import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { CounselorsEntity } from "~shared/core/infrastructure/entities/Counselors.entity";
import { Counselors, CounselorsProps } from "~counselings/aggregates/counselors/domain/counselors";

import { InternalServerErrorException } from "@nestjs/common";
import dayjs from "dayjs";

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
      createdAt: dayjs(entity.createdAt),
      updatedAt: dayjs(entity.updatedAt),
      deletedAt: entity.deletedAt ? dayjs(entity.deletedAt) : null,
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

    entity.createdAt = counselors.createdAt.toISOString();
    entity.updatedAt = counselors.updatedAt.toISOString();
    entity.deletedAt = counselors.deletedAt ? counselors.deletedAt.toISOString() : null;

    return entity;
  }
}
