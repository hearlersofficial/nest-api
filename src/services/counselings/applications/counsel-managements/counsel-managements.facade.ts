import { CounselingOrchestrator } from "~counselings/applications/counsel-managements/counseling.orchestrator";
import { CounselorsService } from "~counselings/domains/counselors/counselors.service";
import { CounselsService } from "~counselings/domains/counsels/counsels.service";
import { CounselInfo } from "~counselings/domains/counsels/models/counsel.info";
import { CounselMessageInfo } from "~counselings/domains/counsels/models/counsel-message.info";
import { PromptVersionsService } from "~counselings/domains/promptVersions/promptVersions.service";
import { CounselMessageReaction } from "~proto/com/hearlers/v1/model/counsel_pb";

import { HttpStatus, Injectable } from "@nestjs/common";
import { BubbleId } from "~common/shared-kernel/identifiers/bubble.id";
import { CounselId } from "~common/shared-kernel/identifiers/counsel.id";
import { CounselMessageId } from "~common/shared-kernel/identifiers/counsel-message.id";
import { CounselorId } from "~common/shared-kernel/identifiers/counselor.id";
import { CounselorUserRelationshipId } from "~common/shared-kernel/identifiers/counselor-user-relationship.id";
import { PromptVersionId } from "~common/shared-kernel/identifiers/prompt-version.id";
import { UserId } from "~common/shared-kernel/identifiers/user.id";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class CounselManagementsFacade {
  private readonly FirstMessage =
    "안녕! 여기는 내 상담실이야. 여기서는 무슨 이야기든 털어놓을 수 있어. 같이 이야기해볼래?";

  constructor(
    private readonly counselService: CounselsService,
    private readonly promptVersionsService: PromptVersionsService,
    private readonly counselorService: CounselorsService,
    private readonly counselingOrchestrator: CounselingOrchestrator,
  ) {}

  @Transactional()
  async createCounsel(params: {
    userId: UserId;
    counselorId: CounselorId;
    promptVersionId?: PromptVersionId;
    bubbleId?: BubbleId;
    responseOptionNumber?: number; // NOTE: 어드민용
  }): Promise<{
    counsel: CounselInfo;
    counselMessages: CounselMessageInfo[];
  }> {
    const { userId, counselorId, bubbleId, responseOptionNumber, promptVersionId } = params;

    const counselor = await this.counselorService.getOne({ counselorId });
    const promptVersion = promptVersionId
      ? await this.promptVersionsService.getOne({ promptVersionId })
      : await this.promptVersionsService.getActiveOne();
    const firstCounselTechniqueId = promptVersion.toneScopedPrompts.find(
      (toneScopedPrompt) => toneScopedPrompt.toneId === counselor.toneId,
    )?.firstCounselTechniqueId;
    if (!firstCounselTechniqueId) {
      throw new HttpStatusBasedRpcException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "First counsel technique at toneId not found",
      );
    }

    const createdCounsel = await this.counselService.create({
      userId,
      counselorId,
      counselTechniqueId: firstCounselTechniqueId,
      promptVersionId: promptVersion.id,
      counselorUserRelationshipId: new CounselorUserRelationshipId(), // TODO: 의미있는 값 넣기
    });

    const counselMessagesResult: CounselMessageInfo[] = [];
    // 버블이 있을때
    if (bubbleId !== undefined) {
      if (responseOptionNumber === undefined) {
        throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "Response option number is required");
      }

      const bubble = await this.counselorService.getBubbleById(bubbleId);
      const introMessage = bubble.question;
      let responseMessage;
      switch (responseOptionNumber) {
        case 1:
          responseMessage = bubble.responseOption1;
          break;
        case 2:
          responseMessage = bubble.responseOption2;
          break;
        default:
          throw new HttpStatusBasedRpcException(
            HttpStatus.BAD_REQUEST,
            "Response option number must be between 1 and 2",
          );
      }

      const createdIntroMessage = await this.counselService.saveMessage({
        counselId: createdCounsel.id,
        message: introMessage,
        isUserMessage: false,
      });
      counselMessagesResult.push(createdIntroMessage.message);

      // ResponseMessage를 통해 상담 진행
      const proceedCounselingResult = await this.counselingOrchestrator.proceedCounseling({
        counselId: createdCounsel.id,
        userMessage: responseMessage,
      });

      counselMessagesResult.push(proceedCounselingResult.createdCounselMessage);
      counselMessagesResult.push(proceedCounselingResult.counselorResponseMessage);
    }
    // 버블이 없을때
    else {
      const createdFirstMessage = await this.counselService.saveMessage({
        counselId: createdCounsel.id,
        message: this.FirstMessage,
        isUserMessage: false,
      });
      counselMessagesResult.push(createdFirstMessage.message);
    }

    return {
      counsel: createdCounsel,
      counselMessages: counselMessagesResult,
    };
  }

  async findCounsels(params: { userId: UserId; counselorId?: CounselorId }): Promise<CounselInfo[]> {
    const { userId, counselorId } = params;

    return this.counselService.getMany({ userId, counselorId, orderBy: { id: "DESC" } });
  }

  async findCounselById(params: { counselId: CounselId }): Promise<CounselInfo> {
    const { counselId } = params;

    return this.counselService.getOne({ counselId });
  }

  @Transactional()
  async createMessage(params: { counselId: CounselId; message: string }): Promise<{
    createdCounselMessage: CounselMessageInfo;
    counselorResponseMessage: CounselMessageInfo;
  }> {
    const { counselId, message } = params;

    const proceedCounselingResult = await this.counselingOrchestrator.proceedCounseling({
      counselId,
      userMessage: message,
    });

    return {
      createdCounselMessage: proceedCounselingResult.createdCounselMessage,
      counselorResponseMessage: proceedCounselingResult.counselorResponseMessage,
    };
  }

  async findMessages(params: { counselId: CounselId }): Promise<CounselMessageInfo[]> {
    const { counselId } = params;

    return this.counselService.getMessages({ counselId, orderBy: { id: "ASC" } });
  }

  @Transactional()
  async reactMessage(params: {
    messageId: CounselMessageId;
    reaction: CounselMessageReaction;
  }): Promise<CounselMessageInfo> {
    const { messageId, reaction } = params;

    return this.counselService.reactMessage({
      counselMessageId: messageId,
      reaction,
    });
  }
}
