import { BubblesReader } from "~counselings/domains/counselors/bubbles.reader";
import { CreateBubbleCommand, UpdateBubbleCommand } from "~counselings/domains/counselors/counselor.command";
import {
  CounselorsCriteriaFindMany,
  FindManyBubblesCriteria,
} from "~counselings/domains/counselors/counselors.criteria";
import { CounselorsReader } from "~counselings/domains/counselors/counselors.reader";
import { CounselorsStore } from "~counselings/domains/counselors/counselors.store";
import { Bubbles } from "~counselings/domains/counselors/models/bubbles";
import { Counselors, CounselorsNewProps } from "~counselings/domains/counselors/models/counselors";

import { HttpStatus, Injectable } from "@nestjs/common";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";

@Injectable()
export class CounselorsService {
  constructor(
    private readonly counselorsReader: CounselorsReader,
    private readonly counselorsStore: CounselorsStore,
    private readonly bubblesReader: BubblesReader,
  ) {}

  async create(newProps: CounselorsNewProps): Promise<Counselors> {
    return this.counselorsStore.create(newProps);
  }

  async update(counselor: Counselors): Promise<Counselors> {
    return this.counselorsStore.update(counselor);
  }

  async findOne(props: { counselorId: UniqueEntityId }): Promise<Counselors | null> {
    return this.counselorsReader.findOne(props);
  }

  async getOne(props: { counselorId: UniqueEntityId }): Promise<Counselors> {
    const counselor = await this.findOne(props);
    if (!counselor) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Counselor not found");
    }
    return counselor;
  }

  async findMany(props: CounselorsCriteriaFindMany): Promise<Counselors[]> {
    return this.counselorsReader.findMany(props);
  }

  async createBubble(command: CreateBubbleCommand): Promise<Bubbles> {
    const counselor = await this.getOne({ counselorId: command.counselorId });
    const bubbleOrFailure = Bubbles.createNew(command);
    if (bubbleOrFailure.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, bubbleOrFailure.error as string);
    }
    const bubble = bubbleOrFailure.value;
    return this.counselorsStore.storeBubble(counselor, bubble);
  }

  async updateBubble(command: UpdateBubbleCommand): Promise<Bubbles> {
    const bubble = await this.getBubbleById(command.bubbleId);
    const counselor = await this.getOne({ counselorId: command.counselorId });
    const bubbleOrFailure = bubble.update(command);
    if (bubbleOrFailure.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, bubbleOrFailure.error as string);
    }
    return this.counselorsStore.storeBubble(counselor, bubble);
  }

  async findBubbles(props: FindManyBubblesCriteria): Promise<Bubbles[]> {
    return this.bubblesReader.findBubbles(props);
  }

  async findRandomBubble(counselorId: UniqueEntityId): Promise<Bubbles> {
    return this.bubblesReader.findRandomBubble(counselorId);
  }

  async findBubbleById(bubbleId: UniqueEntityId): Promise<Bubbles | null> {
    return this.bubblesReader.findBubbleById(bubbleId);
  }

  async getBubbleById(bubbleId: UniqueEntityId): Promise<Bubbles> {
    const bubble = await this.findBubbleById(bubbleId);
    if (!bubble) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Bubble not found");
    }
    return bubble;
  }

  async deleteBubble(props: { counselorId: UniqueEntityId; bubbleId: UniqueEntityId }): Promise<void> {
    const { counselorId, bubbleId } = props;
    const bubble = await this.getBubbleById(bubbleId);
    const counselor = await this.getOne({ counselorId });
    bubble.delete();
    await this.counselorsStore.storeBubble(counselor, bubble);
    return;
  }
}
