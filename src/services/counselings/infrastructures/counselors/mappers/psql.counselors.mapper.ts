import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { CounselorEntity } from "~shared/core/infrastructure/entities/counselors/counselor.entity";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { Counselors, CounselorsProps } from "~counselings/domains/counselors/models/counselors";

import { HttpStatus } from "@nestjs/common";
import dayjs from "dayjs";

export class PsqlCounselorsMapper {
  static toDomain(entity: CounselorEntity): Counselors | null {
    if (!entity) {
      return null;
    }

    const counselorProps: CounselorsProps = {
      name: entity.name,
      gender: entity.gender,
      description: entity.description,
      toneId: new UniqueEntityId(entity.toneId),
      profileImage: entity.profileImage,
      createdAt: dayjs(entity.createdAt),
      updatedAt: dayjs(entity.updatedAt),
      deletedAt: entity.deletedAt ? dayjs(entity.deletedAt) : null,
    };
    const counselorsOrError = Counselors.create(counselorProps, new UniqueEntityId(entity.id));

    if (counselorsOrError.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, counselorsOrError.errorValue);
    }

    return counselorsOrError.value;
  }

  static toDomains(entities: CounselorEntity[]): Counselors[] {
    if (entities.length === 0) {
      return [];
    }
    return entities.map((entity) => this.toDomain(entity)).filter((counselor) => counselor !== null);
  }

  static toEntity(counselors: Counselors): CounselorEntity {
    const entity = new CounselorEntity();

    entity.id = counselors.id.getString();
    entity.name = counselors.name;
    entity.gender = counselors.gender;
    entity.description = counselors.description;
    entity.toneId = counselors.toneId.getString();
    entity.profileImage = counselors.profileImage;
    entity.createdAt = counselors.createdAt.toISOString();
    entity.updatedAt = counselors.updatedAt.toISOString();
    entity.deletedAt = counselors.deletedAt ? counselors.deletedAt.toISOString() : null;

    return entity;
  }

  static toEntities(counselors: Counselors[]): CounselorEntity[] {
    if (counselors.length === 0) {
      return [];
    }
    return counselors.map((counselor) => this.toEntity(counselor));
  }
}
