import { UseCase } from "~shared/core/applications/UseCase";
import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { isDefined } from "~shared/utils/Validate.utils";
import { CounselMessageService } from "~counselings/aggregates/counselMessages/applications/counselMessage.service";
import { CounselMessages } from "~counselings/aggregates/counselMessages/domain/CounselMessages";
import { CounselorService } from "~counselings/aggregates/counselors/applications/counselor.service";
import { CounselService } from "~counselings/aggregates/counsels/applications/counsel.service";
import { CounselTechniqueService } from "~counselings/aggregates/counselTechniques/applications/counselTechnique.service";
import { GenerateGptResponseUseCase } from "~counselings/applications/useCases/GenerateGptResponseUseCase/GenerateGptResponseUseCase";
import { MakeSystemPromptUseCase } from "~counselings/applications/useCases/MakeSystemPromptUseCase/MakeSystemPromptUseCase";
import { ProceedCounselingRequest } from "~counselings/applications/useCases/ProceedCounselingUseCase/dto/ProceedCounseling.request";
import { ProceedCounselingResponse } from "~counselings/applications/useCases/ProceedCounselingUseCase/dto/ProceedCounseling.response";
import { TransitionCounselTechniqueUseCase } from "~counselings/applications/useCases/TransitionCounselTechniqueUseCase/TransitionCounselTechniqueUseCase";

import { HttpStatus, Injectable } from "@nestjs/common";
import { ChatCompletionMessageParam } from "openai/resources";

@Injectable()
export class ProceedCounselingUseCase implements UseCase<ProceedCounselingRequest, ProceedCounselingResponse> {
  private readonly MessageCountForNextPrompt = 200;

  constructor(
    private readonly counselService: CounselService,
    private readonly counselMessageService: CounselMessageService,
    private readonly counselTechniqueService: CounselTechniqueService,
    private readonly counselorService: CounselorService,
    private readonly transitionCounselTechniqueUseCase: TransitionCounselTechniqueUseCase,
    private readonly makeSystemPromptUseCase: MakeSystemPromptUseCase,
    private readonly generateGptResponseUseCase: GenerateGptResponseUseCase,
  ) {}

  async execute(request: ProceedCounselingRequest): Promise<ProceedCounselingResponse> {
    let counsel = request.counsel;
    const { userMessage } = request;

    // 유저 메시지 생성
    const createdUserMessage = await this.counselMessageService.create({
      counselId: counsel.id,
      userId: counsel.userId,
      counselTechniqueId: counsel.counselTechniqueId,
      message: userMessage,
      isUserMessage: true,
    });

    // 상담사 조회
    const counselor = await this.counselorService.findOne(counsel.counselorId);
    if (!counselor) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, "Counselor not found");
    }

    // 이전 대화 조회
    const counselMessages = await this.counselMessageService.findMany({ counselId: counsel.id });

    // 상담기법 변경 여부 확인
    if (this.checkCounselTechniqueChange(counselMessages, counsel.counselTechniqueId)) {
      // 상담 기법 변경
      const transitionCounselTechniqueResponse = await this.transitionCounselTechniqueUseCase.execute({ counsel });
      if (!transitionCounselTechniqueResponse.ok) {
        throw new HttpStatusBasedRpcException(
          HttpStatus.INTERNAL_SERVER_ERROR,
          transitionCounselTechniqueResponse.error as string,
        );
      }
      if (!transitionCounselTechniqueResponse.counsel) {
        throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, "Counsel not found");
      }
      counsel = transitionCounselTechniqueResponse.counsel;
    }

    // 상담 기법 조회
    const counselTechnique = await this.counselTechniqueService.findOne(counsel.counselTechniqueId);
    if (!counselTechnique) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, "CounselTechnique not found");
    }

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
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, "Prompt not found");
    }
    prompts.push(prompt);

    // 이전 대화 추가
    counselMessages.forEach((counselMessage) => {
      prompts.push(counselMessage.makePrompt());
    });

    // 응답 생성
    const generateGptResponseResult = await this.generateGptResponseUseCase.execute({ prompts });
    if (!generateGptResponseResult.ok) {
      throw new HttpStatusBasedRpcException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        generateGptResponseResult.error as string,
      );
    }
    const response = generateGptResponseResult.response;
    if (!isDefined(response)) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, "Response not found");
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
    counsel = await this.counselService.update(counsel);

    return {
      ok: true,
      counsel,
      createdCounselMessage: createdUserMessage,
      counselorResponseMessage: createdSystemMessage,
    };
  }

  private checkCounselTechniqueChange(counselMessages: CounselMessages[], counselTechniqueId: UniqueEntityId): boolean {
    const messageCountAtCurrentTechnique = counselMessages.filter(
      (counselMessage) => counselMessage.counselTechniqueId === counselTechniqueId,
    ).length;
    return messageCountAtCurrentTechnique > this.MessageCountForNextPrompt;
  }
}
