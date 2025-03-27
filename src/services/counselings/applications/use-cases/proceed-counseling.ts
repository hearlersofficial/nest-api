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

import { HttpStatus, Injectable } from "@nestjs/common";
import { ChatCompletionMessageParam } from "openai/resources";

@Injectable()
export class ProceedCounselingUseCase implements UseCase<ProceedCounselingRequest, ProceedCounselingResponse> {
  private readonly MessageCountForNextPrompt = 200;
  private readonly TimeDurationForPromptReset = 1000 * 60 * 60 * 6; // 6 hours

  constructor(
    private readonly counselService: CounselsService,
    private readonly counselMessageService: CounselMessagesService,
    private readonly counselTechniqueService: CounselTechniquesService,
    private readonly counselorService: CounselorsService,
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

    // 상담기법 초기화 여부 확인
    if (this.needCounselTechniqueReset(counselMessages[counselMessages.length - 1])) {
      const firstCounselTechnique = await this.counselTechniqueService.getFirst({
        toneId: counselor.toneId,
      });
      counsel.updateCounselTechniqueId(firstCounselTechnique.id);
      await this.counselService.update(counsel);
    }
    // 상담 기법 변경 여부 확인
    else if (this.needCounselTechniqueTransition(counselMessages)) {
      const transitionCounselTechniqueResponse = await this.transitionCounselTechniqueUseCase.execute({ counsel });
      if (!transitionCounselTechniqueResponse.ok) {
        throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, transitionCounselTechniqueResponse.error as string);
      }
    }

    // 상담 기법 조회
    const counselTechnique = await this.counselTechniqueService.getOne({ counselTechniqueId: counsel.counselTechniqueId });

    const prompts: ChatCompletionMessageParam[] = [];
    // 시스템 프롬프트 생성
    const makeSystemPromptResult = await this.makeSystemPromptUseCase.execute({
      counselTechnique,
      counselor,
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
    counsel.saveLastMessage(createdSystemMessage);
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

  private needCounselTechniqueTransition(counselMessages: CounselMessages[]): boolean {
    let messageCountAtCurrentTechnique = 0;
    const currentCounselTechniqueId = counselMessages[counselMessages.length - 1].counselTechniqueId;
    for (let i = counselMessages.length - 1; i >= 0; i--) {
      if (!counselMessages[i].counselTechniqueId.equals(currentCounselTechniqueId)) {
        break;
      }
      messageCountAtCurrentTechnique++;
    }
    return messageCountAtCurrentTechnique > this.MessageCountForNextPrompt;
  }
}
