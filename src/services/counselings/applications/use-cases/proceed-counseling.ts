import { UseCase } from "~shared/core/applications/UseCase";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { getNowDayjs } from "~shared/utils/Date.utils";
import { isDefined } from "~shared/utils/Validate.utils";
import { ProceedCounselingRequest, ProceedCounselingResponse } from "~counselings/applications/use-cases/dtos/proceed-counseling.dto";
import { GenerateGptResponseUseCase } from "~counselings/applications/use-cases/generate-gpt-response";
import { MakeSystemPromptUseCase } from "~counselings/applications/use-cases/make-system-prompt";
import { TransitionCounselTechniqueUseCase } from "~counselings/applications/use-cases/transition-counselTechique";
import { CounselMessagesService } from "~counselings/domains/counselMessages/counselMessages.service";
import { CounselMessages } from "~counselings/domains/counselMessages/models/counselMessages";
import { CounselorsService } from "~counselings/domains/counselors/counselors.service";
import { CounselsService } from "~counselings/domains/counsels/counsels.service";
import { CounselTechniquesService } from "~counselings/domains/counselTechniques/counselTechniques.service";
import { PromptVersionsService } from "~counselings/domains/promptVersions/promptVersions.service";

import { HttpStatus, Injectable } from "@nestjs/common";
import { ChatCompletionMessageParam } from "openai/resources";

@Injectable()
export class ProceedCounselingUseCase implements UseCase<ProceedCounselingRequest, ProceedCounselingResponse> {
  private readonly TimeDurationForPromptReset = 1000 * 60 * 60 * 6; // 6 hours

  constructor(
    private readonly counselService: CounselsService,
    private readonly counselMessageService: CounselMessagesService,
    private readonly counselTechniqueService: CounselTechniquesService,
    private readonly counselorService: CounselorsService,
    private readonly promptVersionsService: PromptVersionsService,
    private readonly transitionCounselTechniqueUseCase: TransitionCounselTechniqueUseCase,
    private readonly makeSystemPromptUseCase: MakeSystemPromptUseCase,
    private readonly generateGptResponseUseCase: GenerateGptResponseUseCase,
  ) {}

  async execute(request: ProceedCounselingRequest): Promise<ProceedCounselingResponse> {
    const { counsel, userMessage } = request;

    // 상담사 조회
    const counselor = await this.counselorService.getOne({ counselorId: counsel.counselorId });

    // 이전 대화 조회
    const counselMessages = await this.counselMessageService.findMany({ counselId: counsel.id });

    // 프롬프트 버전 조회
    const promptVersion = await this.promptVersionsService.getOne({ promptVersionId: counsel.promptVersionId });
    const counselorScopedPromptResult = promptVersion.getCounselorScopedPrompt(counselor.id);
    if (counselorScopedPromptResult.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, counselorScopedPromptResult.error as string);
    }
    const counselorScopedPrompt = counselorScopedPromptResult.value;
    const toneScopedPromptResult = promptVersion.getToneScopedPrompt(counselor.toneId);
    if (toneScopedPromptResult.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, toneScopedPromptResult.error as string);
    }
    const toneScopedPrompt = toneScopedPromptResult.value;

    // 상담기법 초기화 여부 확인
    if (this.needCounselTechniqueReset(counselMessages[counselMessages.length - 1])) {
      const firstCounselTechniqueId = toneScopedPrompt.firstCounselTechniqueId;
      if (!firstCounselTechniqueId) {
        throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, "First counsel technique not found");
      }
      counsel.updateCounselTechniqueId(firstCounselTechniqueId);
      await this.counselService.update(counsel);
    }
    // 상담 기법 변경 여부 확인
    else if (await this.needCounselTechniqueTransition(counselMessages)) {
      const transitionCounselTechniqueResponse = await this.transitionCounselTechniqueUseCase.execute({ counsel });
      if (!transitionCounselTechniqueResponse.ok) {
        throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, transitionCounselTechniqueResponse.error as string);
      }
    }
    const personaPromptId = counselorScopedPrompt.personaPromptId;
    const tonePromptId = toneScopedPrompt.tonePromptId;
    if (!tonePromptId) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, "Tone prompt ID not found");
    }

    const prompts: ChatCompletionMessageParam[] = [];
    // 시스템 프롬프트 생성
    const makeSystemPromptResult = await this.makeSystemPromptUseCase.execute({
      personaPromptId,
      tonePromptId,
      counselTechniqueId: counsel.counselTechniqueId,
      userId: counsel.userId,
    });
    if (!makeSystemPromptResult.ok) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, makeSystemPromptResult.error as string);
    }
    const prompt = makeSystemPromptResult.prompt;
    if (!isDefined(prompt)) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, "Make System Prompt failed");
    }
    prompts.push(prompt);

    // 유저 메시지 생성
    const createdUserMessage = await this.counselMessageService.create({
      counselId: counsel.id,
      userId: counsel.userId,
      counselTechniqueId: counsel.counselTechniqueId,
      message: userMessage,
      isUserMessage: true,
    });
    counselMessages.push(createdUserMessage);

    // 이전 대화 추가
    counselMessages.forEach((counselMessage) => {
      prompts.push(counselMessage.makePrompt());
    });

    // 응답 생성
    const generateGptResponseResult = await this.generateGptResponseUseCase.execute({ prompts });
    if (!generateGptResponseResult.ok) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, generateGptResponseResult.error as string);
    }
    const response = generateGptResponseResult.response;
    if (!isDefined(response)) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, "Generate GPT Response failed");
    }

    // 시스템 메시지 생성
    const createdSystemMessage = await this.counselMessageService.create({
      counselId: counsel.id,
      userId: counsel.userId,
      counselTechniqueId: counsel.counselTechniqueId,
      message: response,
      isUserMessage: false,
    });

    // 상담 업데이트
    const saveLastMessageResult = counsel.saveLastMessage(createdSystemMessage);
    if (saveLastMessageResult.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, saveLastMessageResult.error as string);
    }
    await this.counselService.update(counsel);

    return {
      ok: true,
      counsel,
      createdCounselMessage: createdUserMessage,
      counselorResponseMessage: createdSystemMessage,
    };
  }

  private needCounselTechniqueReset(lastCounselMessages: CounselMessages): boolean {
    const lastMessageCreatedAt = lastCounselMessages.createdAt;
    const now = getNowDayjs();
    return now.diff(lastMessageCreatedAt) > this.TimeDurationForPromptReset;
  }

  private async needCounselTechniqueTransition(counselMessages: CounselMessages[]): Promise<boolean> {
    let messageCountAtCurrentTechnique = 0;
    const currentCounselTechniqueId = counselMessages[counselMessages.length - 1].counselTechniqueId;
    const currentCounselTechnique = await this.counselTechniqueService.getOne({ counselTechniqueId: currentCounselTechniqueId });
    for (let i = counselMessages.length - 1; i >= 0; i--) {
      const message = counselMessages[i];
      if (!message.isUserMessage) {
        continue;
      }
      if (!message.counselTechniqueId.equals(currentCounselTechniqueId)) {
        break;
      }
      messageCountAtCurrentTechnique++;
    }
    return messageCountAtCurrentTechnique >= currentCounselTechnique.messageThreshold;
  }
}
