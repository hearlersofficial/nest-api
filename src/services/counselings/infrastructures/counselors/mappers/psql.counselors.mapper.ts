import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { BubbleEntity } from "~shared/core/infrastructure/entities/counselors/bubble.entity";
import { CounselorEntity } from "~shared/core/infrastructure/entities/counselors/counselor.entity";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { Bubbles, BubblesProps } from "~counselings/domains/counselors/models/bubbles";
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

  static toBubbleDomain(entity: BubbleEntity): Bubbles;
  static toBubbleDomain(entity: null): null;
  static toBubbleDomain(entity: BubbleEntity | null): Bubbles | null {
    if (!entity) {
      return null;
    }

    const bubbleProps: BubblesProps = {
      question: entity.question,
      responseOption1: entity.responseOption1,
      responseOption2: entity.responseOption2,
      createdAt: dayjs(entity.createdAt),
      updatedAt: dayjs(entity.updatedAt),
      deletedAt: entity.deletedAt ? dayjs(entity.deletedAt) : null,
    };
    const bubblesOrError = Bubbles.create(bubbleProps, new UniqueEntityId(entity.id));

    if (bubblesOrError.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, bubblesOrError.errorValue);
    }

    return bubblesOrError.value;
  }

  static toBubbleDomains(entities: BubbleEntity[]): Bubbles[] {
    if (entities.length === 0) {
      return [];
    }
    return entities.map((entity) => this.toBubbleDomain(entity)).filter((bubble) => bubble !== null);
  }

  static toBubbleEntity(counselor: Counselors, bubble: Bubbles): BubbleEntity {
    const entity = new BubbleEntity();

    entity.id = bubble.id.getString();
    entity.counselorId = counselor.id.getString();
    entity.question = bubble.question;
    entity.responseOption1 = bubble.responseOption1;
    entity.responseOption2 = bubble.responseOption2;
    entity.createdAt = bubble.createdAt.toISOString();
    entity.updatedAt = bubble.updatedAt.toISOString();
    entity.deletedAt = bubble.deletedAt ? bubble.deletedAt.toISOString() : null;

    return entity;
  }
}
