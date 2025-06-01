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
import { BubblesInfo, CounselorsInfo } from "~counselings/domains/counselors/models/counselors.info";
import { CounselorGender } from "~proto/com/hearlers/v1/model/counselor_pb";

import { HttpStatus, Injectable } from "@nestjs/common";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class CounselorsService {
  constructor(
    private readonly counselorsReader: CounselorsReader,
    private readonly counselorsStore: CounselorsStore,
    private readonly bubblesReader: BubblesReader,
  ) {}

  @Transactional()
  async create(newProps: CounselorsNewProps): Promise<CounselorsInfo> {
    const counselor = await this.counselorsStore.create(newProps);
    return CounselorsInfo.fromDomain(counselor);
  }

  @Transactional()
  async update(counselor: Counselors): Promise<CounselorsInfo> {
    const updatedCounselor = await this.counselorsStore.update(counselor);
    return CounselorsInfo.fromDomain(updatedCounselor);
  }

  @Transactional()
  async updateCounselor(params: {
    counselorId: UniqueEntityId;
    toneId?: UniqueEntityId;
    name?: string;
    description?: string;
    profileImage?: string;
    gender?: CounselorGender;
  }): Promise<CounselorsInfo> {
    const { counselorId, toneId, name, description, profileImage, gender } = params;
    const counselor = await this.getCounselorDomainById(counselorId);

    counselor.update({
      toneId,
      name,
      description,
      profileImage,
      gender,
    });

    const validateResult = counselor.validateDomain();
    if (validateResult.isFailureResult()) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, validateResult.error);
    }

    const updatedCounselor = await this.counselorsStore.update(counselor);
    return CounselorsInfo.fromDomain(updatedCounselor);
  }

  async findOne(props: { counselorId: UniqueEntityId }): Promise<CounselorsInfo | null> {
    const counselor = await this.counselorsReader.findOne(props);
    return counselor ? CounselorsInfo.fromDomain(counselor) : null;
  }

  async getOne(props: { counselorId: UniqueEntityId }): Promise<CounselorsInfo> {
    const counselor = await this.findOne(props);
    if (!counselor) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Counselor not found");
    }
    return counselor;
  }

  private async getCounselorDomainById(counselorId: UniqueEntityId): Promise<Counselors> {
    const counselor = await this.counselorsReader.findOne({ counselorId });
    if (!counselor) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Counselor not found");
    }
    return counselor;
  }

  async findMany(props: CounselorsCriteriaFindMany): Promise<CounselorsInfo[]> {
    const counselors = await this.counselorsReader.findMany(props);
    return CounselorsInfo.fromDomainArray(counselors);
  }

  @Transactional()
  async createBubble(command: CreateBubbleCommand): Promise<BubblesInfo> {
    const counselor = await this.getCounselorDomainById(command.counselorId);
    const bubbleOrFailure = Bubbles.createNew(command);
    if (bubbleOrFailure.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, bubbleOrFailure.error as string);
    }
    const bubble = bubbleOrFailure.value;
    const storedBubble = await this.counselorsStore.storeBubble(counselor, bubble);
    return BubblesInfo.fromDomain(storedBubble);
  }

  @Transactional()
  async updateBubble(command: UpdateBubbleCommand): Promise<BubblesInfo> {
    const bubble = await this.getBubbleDomainById(command.bubbleId);
    const counselor = await this.getCounselorDomainById(command.counselorId);
    const bubbleOrFailure = bubble.update(command);
    if (bubbleOrFailure.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, bubbleOrFailure.error as string);
    }
    const storedBubble = await this.counselorsStore.storeBubble(counselor, bubble);
    return BubblesInfo.fromDomain(storedBubble);
  }

  async findBubbles(props: FindManyBubblesCriteria): Promise<BubblesInfo[]> {
    const bubbles = await this.bubblesReader.findBubbles(props);
    return BubblesInfo.fromDomainArray(bubbles);
  }

  async findRandomBubble(counselorId: UniqueEntityId): Promise<BubblesInfo> {
    const bubble = await this.bubblesReader.findRandomBubble(counselorId);
    return BubblesInfo.fromDomain(bubble);
  }

  async findBubbleById(bubbleId: UniqueEntityId): Promise<BubblesInfo | null> {
    const bubble = await this.bubblesReader.findBubbleById(bubbleId);
    return bubble ? BubblesInfo.fromDomain(bubble) : null;
  }

  async getBubbleById(bubbleId: UniqueEntityId): Promise<BubblesInfo> {
    const bubble = await this.findBubbleById(bubbleId);
    if (!bubble) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Bubble not found");
    }
    return bubble;
  }

  private async getBubbleDomainById(bubbleId: UniqueEntityId): Promise<Bubbles> {
    const bubble = await this.bubblesReader.findBubbleById(bubbleId);
    if (!bubble) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Bubble not found");
    }
    return bubble;
  }

  @Transactional()
  async deleteBubble(props: { counselorId: UniqueEntityId; bubbleId: UniqueEntityId }): Promise<void> {
    const { counselorId, bubbleId } = props;
    const bubble = await this.getBubbleDomainById(bubbleId);
    const counselor = await this.getCounselorDomainById(counselorId);
    bubble.delete();
    await this.counselorsStore.storeBubble(counselor, bubble);
    return;
  }
}
