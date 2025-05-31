import { BubblesReader } from "~counselings/domains/counselors/bubbles.reader";
import { FindManyBubblesCriteria } from "~counselings/domains/counselors/counselors.criteria";
import { RepositoryCounselorCriteriaMapper } from "~counselings/domains/counselors/infrastructures/mappers/repository-counselors-criteria.mapper";
import { Bubbles } from "~counselings/domains/counselors/models/bubbles";
import { CounselorsRepository } from "~counselings/infrastructures/counselors/counselors.repository";

import { Injectable } from "@nestjs/common";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";

@Injectable()
export class RepositoryBubblesReader extends BubblesReader {
  constructor(private readonly counselorsRepository: CounselorsRepository) {
    super();
  }

  override async findBubbles(props: FindManyBubblesCriteria): Promise<Bubbles[]> {
    const typeormOptions = RepositoryCounselorCriteriaMapper.toFindBubblesOptions(props);
    return this.counselorsRepository.findBubbles(typeormOptions);
  }

  override async findRandomBubble(counselorId: UniqueEntityId): Promise<Bubbles> {
    return this.counselorsRepository.findRandomBubble(counselorId);
  }

  override async findBubbleById(bubbleId: UniqueEntityId): Promise<Bubbles | null> {
    return this.counselorsRepository.findBubbleById(bubbleId);
  }
}
