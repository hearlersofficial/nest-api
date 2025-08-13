import { Bubbles, BubblesProps } from "~counselings/domains/counselors/models/bubbles";
import { Counselors, CounselorsProps } from "~counselings/domains/counselors/models/counselors";

import { HttpStatus } from "@nestjs/common";
import { BubbleId } from "~common/shared-kernel/identifiers/bubble.id";
import { CounselorId } from "~common/shared-kernel/identifiers/counselor.id";
import { ToneId } from "~common/shared-kernel/identifiers/tone.id";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";
import { BubbleEntity } from "~common/system/persistences/entities/counselors/bubble.entity";
import { CounselorEntity } from "~common/system/persistences/entities/counselors/counselor.entity";
import dayjs from "dayjs";

export class PsqlCounselorsMapper {
  static toDomain(entity: null): null;
  static toDomain(entity: CounselorEntity): Counselors;
  static toDomain(entity: CounselorEntity | null): Counselors | null;
  static toDomain(entity: CounselorEntity | null): Counselors | null {
    if (!entity) {
      return null;
    }

    const counselorProps: CounselorsProps = {
      name: entity.name,
      gender: entity.gender,
      description: entity.description,
      toneId: new ToneId(entity.toneId),
      profileImage: entity.profileImage,
      createdAt: dayjs(entity.createdAt),
      updatedAt: dayjs(entity.updatedAt),
      deletedAt: entity.deletedAt ? dayjs(entity.deletedAt) : null,
    };
    const counselorsOrError = Counselors.create(counselorProps, new CounselorId(entity.id));

    if (counselorsOrError.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, counselorsOrError.errorValue);
    }

    return counselorsOrError.value;
  }

  static toDomains(entities: CounselorEntity[]): Counselors[] {
    return (entities ?? []).map((entity) => this.toDomain(entity));
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
    return (counselors ?? []).map((counselor) => this.toEntity(counselor));
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
    const bubblesOrError = Bubbles.create(bubbleProps, new BubbleId(entity.id));

    if (bubblesOrError.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, bubblesOrError.errorValue);
    }

    return bubblesOrError.value;
  }

  static toBubbleDomains(entities: BubbleEntity[]): Bubbles[] {
    return (entities ?? []).map((entity) => this.toBubbleDomain(entity));
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
