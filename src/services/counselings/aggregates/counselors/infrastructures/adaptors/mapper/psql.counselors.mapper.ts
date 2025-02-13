<<<<<<< HEAD:src/services/counselings/aggregates/counselors/infrastructures/adaptors/mapper/psql.counselors.mapper.ts
import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { CounselorsEntity } from "~shared/core/infrastructure/entities/Counselor.entity";
import { convertDayjs, formatDayjs } from "~shared/utils/Date.utils";
import { Counselors } from "~counselings/aggregates/counselors/domain/counselors";

=======
import { CounselorsEntity } from "~/src/shared/core/infrastructure/entities/Counselors.entity";
import { Counselors } from "../../../domain/counselors";
import { convertDayjs, formatDayjs } from "~/src/shared/utils/Date.utils";
import { UniqueEntityId } from "~/src/shared/core/domain/UniqueEntityId";
>>>>>>> 270a161 (feat: snowflakeid 추가 새 프로덕트에 맞는 디비 구조 정립):src/aggregates/counselors/infrastructures/adaptors/mapper/psql.counselors.mapper.ts
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
      entity.id = counselors.id.getString();
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
