import { BubblesReader } from "~counselings/domains/counselors/bubbles.reader";
import { FindManyBubblesCriteria } from "~counselings/domains/counselors/counselors.criteria";
import { CounselorsRepository } from "~counselings/domains/counselors/infrastructures/counselors.repository";
import { RepositoryCounselorCriteriaMapper } from "~counselings/domains/counselors/infrastructures/mappers/repository-counselors-criteria.mapper";
import { Bubbles } from "~counselings/domains/counselors/models/bubbles";

import { HttpStatus, Injectable } from "@nestjs/common";
import { BubbleId } from "~common/shared-kernel/identifiers/bubble.id";
import { CounselorId } from "~common/shared-kernel/identifiers/counselor.id";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";

@Injectable()
export class RepositoryBubblesReader extends BubblesReader {
  constructor(private readonly counselorsRepository: CounselorsRepository) {
    super();
  }

  override async findBubbles(props: FindManyBubblesCriteria): Promise<Bubbles[]> {
    const typeormOptions = RepositoryCounselorCriteriaMapper.toFindBubblesOptions(props);
    return this.counselorsRepository.findBubbles(typeormOptions);
  }

  override async findRandomBubble(counselorId: CounselorId): Promise<Bubbles> {
    return this.counselorsRepository.findRandomBubble(counselorId);
  }

  override async findBubbleById(bubbleId: BubbleId): Promise<Bubbles | null> {
    return this.counselorsRepository.findBubbleById(bubbleId);
  }

  override async getBubbleById(bubbleId: BubbleId): Promise<Bubbles> {
    const bubble = await this.counselorsRepository.findBubbleById(bubbleId);
    if (!bubble) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Bubble not found");
    }
    return bubble;
  }
}
