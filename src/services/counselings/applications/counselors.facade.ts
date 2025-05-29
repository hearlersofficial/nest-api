import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { CounselorsService } from "~counselings/domains/counselors/counselors.service";
import { Bubbles } from "~counselings/domains/counselors/models/bubbles";
import { Counselors } from "~counselings/domains/counselors/models/counselors";
import { CounselorGender } from "~proto/com/hearlers/v1/model/counselor_pb";

import { BadRequestException, Injectable } from "@nestjs/common";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class CounselorsFacade {
  constructor(private readonly counselorsService: CounselorsService) {}

  @Transactional()
  async createCounselor(params: {
    toneId: UniqueEntityId;
    name: string;
    description: string;
    profileImage: string;
    counselorGender: CounselorGender;
  }): Promise<Counselors> {
    const { toneId, name, description, profileImage, counselorGender } = params;
    return this.counselorsService.create({
      toneId,
      name,
      description,
      profileImage,
      gender: counselorGender,
    });
  }

  async findCounselors(params: {
    toneId?: UniqueEntityId;
  }): Promise<Counselors[]> {
    const { toneId } = params;
    return this.counselorsService.findMany({ toneId });
  }

  async findCounselorById(params: {
    counselorId: UniqueEntityId;
  }): Promise<Counselors> {
    const { counselorId } = params;
    return this.counselorsService.getOne({ counselorId });
  }

  @Transactional()
  async updateCounselor(params: {
    counselorId: UniqueEntityId;
    toneId?: UniqueEntityId;
    name?: string;
    description?: string;
    profileImage?: string;
    counselorGender?: CounselorGender;
  }): Promise<Counselors> {
    const {
      counselorId,
      toneId,
      name,
      description,
      profileImage,
      counselorGender,
    } = params;
    const counselor = await this.counselorsService.getOne({ counselorId });
    counselor.update({
      toneId,
      name,
      description,
      profileImage,
      gender: counselorGender,
    });
    const validateResult = counselor.validateDomain();
    if (validateResult.isFailureResult()) {
      throw new BadRequestException(validateResult.error);
    }
    return this.counselorsService.update(counselor);
  }

  @Transactional()
  async createBubble(params: {
    counselorId: UniqueEntityId;
    question: string;
    responseOption1: string;
    responseOption2: string;
  }): Promise<Bubbles> {
    const { counselorId, question, responseOption1, responseOption2 } = params;
    return this.counselorsService.createBubble({
      counselorId,
      question,
      responseOption1,
      responseOption2,
    });
  }

  async findBubbles(params: {
    counselorId: UniqueEntityId;
  }): Promise<Bubbles[]> {
    const { counselorId } = params;
    return this.counselorsService.findBubbles({ counselorId });
  }

  async findRandomBubble(params: {
    counselorId: UniqueEntityId;
  }): Promise<Bubbles> {
    const { counselorId } = params;
    return this.counselorsService.findRandomBubble(counselorId);
  }

  async findBubbleById(params: {
    bubbleId: UniqueEntityId;
  }): Promise<Bubbles | null> {
    const { bubbleId } = params;
    return this.counselorsService.findBubbleById(bubbleId);
  }

  async updateBubble(params: {
    bubbleId: UniqueEntityId;
    counselorId: UniqueEntityId;
    question?: string;
    responseOption1?: string;
    responseOption2?: string;
  }): Promise<Bubbles> {
    const {
      bubbleId,
      counselorId,
      question,
      responseOption1,
      responseOption2,
    } = params;
    return this.counselorsService.updateBubble({
      bubbleId,
      counselorId,
      question,
      responseOption1,
      responseOption2,
    });
  }

  async deleteBubble(params: {
    counselorId: UniqueEntityId;
    bubbleId: UniqueEntityId;
  }): Promise<void> {
    const { counselorId, bubbleId } = params;
    await this.counselorsService.deleteBubble({ counselorId, bubbleId });
    return;
  }
}
