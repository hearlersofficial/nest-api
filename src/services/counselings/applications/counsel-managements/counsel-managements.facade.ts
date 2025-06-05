import { CounselWithMessages } from "~counselings/applications/types/counsel.type";
import { CreatedAndResponseMessages } from "~counselings/applications/types/counselMessage.type";
import { ProceedCounselingUseCase } from "~counselings/applications/use-cases/proceed-counseling";
import { CounselMessagesService } from "~counselings/domains/counselMessages/counselMessages.service";
import { CounselMessageInfo } from "~counselings/domains/counselMessages/models/counselMessage.info";
import { CounselorsService } from "~counselings/domains/counselors/counselors.service";
import { CounselsService } from "~counselings/domains/counsels/counsels.service";
import { CounselInfo } from "~counselings/domains/counsels/models/counsel.info";
import { PromptVersionsService } from "~counselings/domains/promptVersions/promptVersions.service";
import { CounselMessageReaction } from "~proto/com/hearlers/v1/model/counsel_pb";

import { HttpStatus, Injectable } from "@nestjs/common";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class CounselManagementsFacade {
  private readonly FirstMessage =
    "안녕! 여기는 내 상담실이야. 여기서는 무슨 이야기든 털어놓을 수 있어. 같이 이야기해볼래?";

  constructor(
    private readonly counselService: CounselsService,
    private readonly counselMessagesService: CounselMessagesService,
    private readonly promptVersionsService: PromptVersionsService,
    private readonly counselorService: CounselorsService,
    private readonly proceedCounselingUseCase: ProceedCounselingUseCase,
  ) {}

  @Transactional()
  async createCounsel(params: {
    userId: UniqueEntityId;
    counselorId: UniqueEntityId;
    introMessage?: string;
    responseMessage?: string;
  }): Promise<CounselWithMessages> {
    const { userId, counselorId, introMessage, responseMessage } = params;

    const counselor = await this.counselorService.getOne({ counselorId });
    const activeVersion = await this.promptVersionsService.getActiveOne();
    const firstCounselTechniqueId = activeVersion.toneScopedPrompts.find(
      (toneScopedPrompt) => toneScopedPrompt.toneId === counselor.toneId,
    )?.firstCounselTechniqueId;
    if (!firstCounselTechniqueId) {
      throw new HttpStatusBasedRpcException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "First counsel technique at toneId not found",
      );
    }

    let createdCounsel = await this.counselService.create({
      userId,
      counselorId,
      counselTechniqueId: new UniqueEntityId(firstCounselTechniqueId),
      promptVersionId: new UniqueEntityId(activeVersion.id),
      counselorUserRelationshipId: new UniqueEntityId(), // TODO: 의미있는 값 넣기
    });

    const counselMessagesResult: CounselMessageInfo[] = [];
    // 버블이 있을때
    if (introMessage !== undefined || responseMessage !== undefined) {
      if (introMessage === undefined) {
        throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "Intro message is required");
      }
      if (responseMessage === undefined) {
        throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "Response message is required");
      }

      const createdIntroMessage = await this.counselMessagesService.create({
        counselId: new UniqueEntityId(createdCounsel.id),
        userId,
        counselTechniqueId: new UniqueEntityId(firstCounselTechniqueId),
        message: introMessage,
        isUserMessage: false,
      });
      counselMessagesResult.push(createdIntroMessage);

      // ResponseMessage를 통해 상담 진행
      const proceedCounselingResult = await this.proceedCounselingUseCase.execute({
        counselId: new UniqueEntityId(createdCounsel.id),
        userMessage: responseMessage,
      });
      if (!proceedCounselingResult.ok) {
        throw new HttpStatusBasedRpcException(
          HttpStatus.INTERNAL_SERVER_ERROR,
          proceedCounselingResult.error as string,
        );
      }
      counselMessagesResult.push(proceedCounselingResult.createdCounselMessage);
      counselMessagesResult.push(proceedCounselingResult.counselorResponseMessage);
    }
    // 버블이 없을때
    else {
      const createdFirstMessage = await this.counselMessagesService.create({
        counselId: new UniqueEntityId(createdCounsel.id),
        userId,
        counselTechniqueId: new UniqueEntityId(firstCounselTechniqueId),
        message: this.FirstMessage,
        isUserMessage: false,
      });
      counselMessagesResult.push(createdFirstMessage);

      // 상담 정보 최신화
      createdCounsel = await this.counselService.saveLastMessage({
        counselId: new UniqueEntityId(createdCounsel.id),
        lastMessage: createdFirstMessage.message,
      });
    }

    return {
      counsel: createdCounsel,
      counselMessages: counselMessagesResult,
    };
  }

  async findCounsels(params: { userId: UniqueEntityId; counselorId?: UniqueEntityId }): Promise<CounselInfo[]> {
    const { userId, counselorId } = params;

    return this.counselService.getMany({ userId, counselorId });
  }

  async findCounselById(params: { counselId: UniqueEntityId }): Promise<CounselInfo> {
    const { counselId } = params;

    return this.counselService.getOne({ counselId });
  }

  @Transactional()
  async createMessage(params: { counselId: UniqueEntityId; message: string }): Promise<CreatedAndResponseMessages> {
    const { counselId, message } = params;

    const proceedCounselingResult = await this.proceedCounselingUseCase.execute({
      counselId,
      userMessage: message,
    });
    if (!proceedCounselingResult.ok) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, proceedCounselingResult.error as string);
    }
    return {
      createdCounselMessage: proceedCounselingResult.createdCounselMessage,
      counselorResponseMessage: proceedCounselingResult.counselorResponseMessage,
    };
  }

  async findMessages(params: { counselId: UniqueEntityId }) {
    const { counselId } = params;

    return this.counselMessagesService.getMany({ counselId });
  }

  @Transactional()
  async reactMessage(params: {
    messageId: UniqueEntityId;
    reaction: CounselMessageReaction;
  }): Promise<CounselMessageInfo> {
    const { messageId, reaction } = params;

    return this.counselMessagesService.reactMessage({
      counselMessageId: messageId,
      reaction,
    });
  }
}
