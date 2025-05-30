import { Bubbles } from "~counselings/domains/counselors/models/bubbles";
import { Counselors } from "~counselings/domains/counselors/models/counselors";

import { Injectable } from "@nestjs/common";
import { UniqueEntityId } from "~common/shared-kernel/domains/UniqueEntityId";
import { BubbleEntity } from "~common/system/persistences/entities/counselors/bubble.entity";
import { CounselorEntity } from "~common/system/persistences/entities/counselors/counselor.entity";
import { FindManyOptions, FindOneOptions } from "typeorm";

@Injectable()
export abstract class CounselorsRepository {
  abstract findByCounselorId(
    counselorId: UniqueEntityId,
    options?: FindOneOptions<CounselorEntity>,
  ): Promise<Counselors | null>;
  abstract findMany(options?: FindManyOptions<CounselorEntity>): Promise<Counselors[]>;
  abstract findBubbles(options?: FindManyOptions<BubbleEntity>): Promise<Bubbles[]>;
  abstract findRandomBubble(counselorId: UniqueEntityId): Promise<Bubbles>;
  abstract findBubbleById(bubbleId: UniqueEntityId): Promise<Bubbles | null>;
  abstract save(counselor: Counselors): Promise<Counselors>;
  abstract save(counselors: Counselors[]): Promise<Counselors[]>;

  abstract saveBubble(counselor: Counselors, bubble: Bubbles): Promise<Bubbles>;
}
