import { CounselWithMessages } from "~counselings/applications/types/counsel.type";
import { ProceedCounselingUseCase } from "~counselings/applications/use-cases/proceed-counseling";
import { CounselMessagesService } from "~counselings/domains/counselMessages/counselMessages.service";
import { CounselMessages } from "~counselings/domains/counselMessages/models/counselMessages";
import { CounselorsService } from "~counselings/domains/counselors/counselors.service";
import { CounselsService } from "~counselings/domains/counsels/counsels.service";
import { Counsels } from "~counselings/domains/counsels/models/counsels";
import { CounselTechniquesService } from "~counselings/domains/counselTechniques/counselTechniques.service";
import { PromptVersionsService } from "~counselings/domains/promptVersions/promptVersions.service";

import { HttpStatus, Injectable } from "@nestjs/common";
import { isDefined } from "~common/shared/utils/validate";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class CounselsFacade {
  private readonly FirstMessage =
    "안녕! 여기는 내 상담실이야. 여기서는 무슨 이야기든 털어놓을 수 있어. 같이 이야기해볼래?";

  constructor(
    private readonly counselsService: CounselsService,
    private readonly counselorService: CounselorsService,
    private readonly counselTechniqueService: CounselTechniquesService,
    private readonly counselMessagesService: CounselMessagesService,
    private readonly promptVersionsService: PromptVersionsService,
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

    const activeVersion = await this.promptVersionsService.getActiveOne();

    const counselor = await this.counselorService.getOne({ counselorId });
    const toneId = counselor.toneId;

    const toneScopedPromptResult = activeVersion.getToneScopedPrompt(toneId);
    if (toneScopedPromptResult.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, toneScopedPromptResult.error as string);
    }
    const toneScopedPrompt = toneScopedPromptResult.value;
    const firstCounselTechniqueId = toneScopedPrompt.firstCounselTechniqueId;
    if (!firstCounselTechniqueId) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, "First counsel technique not found");
    }

    const createdCounsel = await this.counselsService.create({
      userId,
      counselorId,
      counselTechniqueId: firstCounselTechniqueId,
      promptVersionId: activeVersion.id,
      // TODO: 의미있는 값 넣기
      counselorUserRelationshipId: new UniqueEntityId(),
    });

    const counselMessagesResult: CounselMessages[] = [];

    if (introMessage || responseMessage) {
      if (!isDefined(introMessage)) {
        throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "Intro message is required");
      }
      if (!isDefined(responseMessage)) {
        throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "Response message is required");
      }
      // Intro message 생성
      const createdIntroMessage = await this.counselMessagesService.create({
        counselId: createdCounsel.id,
        userId: createdCounsel.userId,
        counselTechniqueId: createdCounsel.counselTechniqueId,
        message: introMessage,
        isUserMessage: false,
      });
      counselMessagesResult.push(createdIntroMessage);

      // ResponseMessage를 통해 상담 진행
      const proceedCounselingResult = await this.proceedCounselingUseCase.execute({
        counsel: createdCounsel,
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
    } else {
      // 초기 메시지 생성
      const createdFirstMessage = await this.counselMessagesService.create({
        counselId: createdCounsel.id,
        userId: createdCounsel.userId,
        counselTechniqueId: createdCounsel.counselTechniqueId,
        message: this.FirstMessage,
        isUserMessage: false,
      });
      counselMessagesResult.push(createdFirstMessage);

      // 마지막 채팅 업데이트
      const saveLastMessageResult = createdCounsel.saveLastMessage(createdFirstMessage);
      if (saveLastMessageResult.isFailure) {
        throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, saveLastMessageResult.error as string);
      }
      await this.counselsService.update(createdCounsel);
    }

    return { counsel: createdCounsel, counselMessages: counselMessagesResult };
  }

  async findCounsels(params: { userId: UniqueEntityId; counselorId?: UniqueEntityId }): Promise<Counsels[]> {
    const { userId, counselorId } = params;
    return this.counselsService.findMany({ userId, counselorId });
  }

  async findCounselById(params: { counselId: UniqueEntityId }): Promise<Counsels> {
    const { counselId } = params;
    return this.counselsService.getOne({ counselId });
  }
}
