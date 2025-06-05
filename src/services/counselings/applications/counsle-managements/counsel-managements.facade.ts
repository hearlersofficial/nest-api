import { CounselMessagesService } from "~counselings/domains/counselMessages/counselMessages.service";
import { CounselorsService } from "~counselings/domains/counselors/counselors.service";
import { CounselsService } from "~counselings/domains/counsels/counsels.service";
import { PromptVersionsService } from "~counselings/domains/promptVersions/promptVersions.service";
import { CounselMessageReaction } from "~proto/com/hearlers/v1/model/counsel_pb";

import { Injectable } from "@nestjs/common";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";

@Injectable()
export class CounselManagementsFacade {
  constructor(
    private readonly counselService: CounselsService,
    private readonly counselMessagesService: CounselMessagesService,
    private readonly promptVersionsService: PromptVersionsService,
    private readonly counselorService: CounselorsService,
  ) {}

  async createCounsel(params: {
    userId: UniqueEntityId;
    counselorId: UniqueEntityId;
    introMessage?: string;
    responseMessage?: string;
  }) {
    const { userId, counselorId, introMessage, responseMessage } = params;

    const counselor = await this.counselorService.getOne({ counselorId });
    const firstCounselTechniqueId = await this.promptVersionsService.getFirstCounselTechniqueIdInActiveVersion({
      toneId: new UniqueEntityId(counselor.toneId),
    });
    const activeVersion = await this.promptVersionsService.getActiveOne();

    const createdCounsel = await this.counselService.create({
      userId,
      counselorId,
      counselTechniqueId: firstCounselTechniqueId,
      promptVersionId: new UniqueEntityId(activeVersion.id),
      counselorUserRelationshipId: new UniqueEntityId(), // TODO: 의미있는 값 넣기
    });
  }

  async findCounsels(params: { userId: UniqueEntityId; counselorId?: UniqueEntityId }) {}

  async findCounselById(params: { counselId: UniqueEntityId }) {}

  async createCounselMessage(params: { counselId: UniqueEntityId; message: string }) {}

  async findCounselMessages(params: { counselId: UniqueEntityId }) {}

  async reactCounselMessage(params: { messageId: UniqueEntityId; reaction: CounselMessageReaction }) {}
}
