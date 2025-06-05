import {
  ProceedCounselingRequest,
  ProceedCounselingResponse,
} from "~counselings/applications/use-cases/dtos/proceed-counseling.dto";
import { CounselMessagesService } from "~counselings/domains/counselMessages/counselMessages.service";
import { CounselorsService } from "~counselings/domains/counselors/counselors.service";
import { CounselsService } from "~counselings/domains/counsels/counsels.service";
import { CounselTechniquesService } from "~counselings/domains/counselTechniques/counselTechniques.service";
import { LlmService } from "~counselings/domains/llm/llm.service";
import { LlmRequest } from "~counselings/domains/llm/models/llm-request";
import { PersonaPromptsService } from "~counselings/domains/personaPrompts/personaPrompts.service";
import { PromptVersionsService } from "~counselings/domains/promptVersions/promptVersions.service";
import { TonePromptsService } from "~counselings/domains/tonePrompts/tonePrompts.service";

import { HttpStatus, Injectable } from "@nestjs/common";
import { getNowDayjs } from "~common/shared/utils/date";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";
import { UseCase } from "~common/shared-kernel/interfaces/UseCase";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";

@Injectable()
export class ProceedCounselingUseCase implements UseCase<ProceedCounselingRequest, ProceedCounselingResponse> {
  private readonly TimeDurationForPromptReset = 1000 * 60 * 60 * 6; // 6 hours

  constructor(
    private readonly counselService: CounselsService,
    private readonly counselorService: CounselorsService,
    private readonly counselMessageService: CounselMessagesService,
    private readonly promptVersionsService: PromptVersionsService,
    private readonly counselTechniqueService: CounselTechniquesService,
    private readonly personaPromptService: PersonaPromptsService,
    private readonly tonePromptService: TonePromptsService,
    private readonly llmService: LlmService,
  ) {}

  async execute(request: ProceedCounselingRequest): Promise<ProceedCounselingResponse> {
    const { counselId, userMessage } = request;

    let counsel = await this.counselService.getOne({ counselId });

    // 상담사 조회
    const counselor = await this.counselorService.getOne({ counselorId: new UniqueEntityId(counsel.counselorId) });

    // 이전 대화 조회
    const counselMessages = await this.counselMessageService.getMany({ counselId: new UniqueEntityId(counsel.id) });

    // 프롬프트 버전 조회
    const promptVersion = await this.promptVersionsService.getOne({
      promptVersionId: new UniqueEntityId(counsel.promptVersionId),
    });
    const counselorScopedPrompt = promptVersion.counselorScopedPrompts.find(
      (prompt) => prompt.counselorId === counselor.id,
    );
    if (!counselorScopedPrompt) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, "Counselor scoped prompt not found");
    }
    const toneScopedPrompt = promptVersion.toneScopedPrompts.find((prompt) => prompt.toneId === counselor.toneId);
    if (!toneScopedPrompt) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, "Tone scoped prompt not found");
    }

    // 상담기법 초기화 여부 확인
    const lastMessageCreatedAt = counselMessages[counselMessages.length - 1].createdAt;
    const now = getNowDayjs();
    if (now.diff(lastMessageCreatedAt) > this.TimeDurationForPromptReset) {
      const firstCounselTechniqueId = toneScopedPrompt.firstCounselTechniqueId;
      if (!firstCounselTechniqueId) {
        throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, "First counsel technique not found");
      }
      counsel = await this.counselService.updateCounselTechniqueId({
        counselId: new UniqueEntityId(counsel.id),
        counselTechniqueId: new UniqueEntityId(firstCounselTechniqueId),
      });
    }

    // 상담 기법 조회
    let counselTechnique = await this.counselTechniqueService.getOne({
      counselTechniqueId: new UniqueEntityId(counsel.counselTechniqueId),
    });

    // 상담 기법 변경 여부 확인
    let messageCountAtCurrentTechnique = 0;
    for (let i = counselMessages.length - 1; i >= 0; i--) {
      const message = counselMessages[i];
      if (!message.isUserMessage) {
        continue;
      }
      if (message.counselTechniqueId !== counsel.counselTechniqueId) {
        break;
      }
      messageCountAtCurrentTechnique++;
    }
    if (messageCountAtCurrentTechnique >= counselTechnique.messageThreshold) {
      if (counselTechnique.nextTechniqueId) {
        // 다음 상담 기법으로 전환
        counselTechnique = await this.counselTechniqueService.getOne({
          counselTechniqueId: new UniqueEntityId(counselTechnique.nextTechniqueId),
        });
        counsel = await this.counselService.updateCounselTechniqueId({
          counselId: new UniqueEntityId(counsel.id),
          counselTechniqueId: new UniqueEntityId(counselTechnique.id),
        });
      } else {
        // TODO: 마지막 상담 기법인 경우
      }
    }

    const personaPromptId = counselorScopedPrompt.personaPromptId;
    const tonePromptId = toneScopedPrompt.tonePromptId;
    if (!tonePromptId) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, "Tone prompt ID not found");
    }

    const prompts: LlmRequest[] = [];

    // 시스템 프롬프트 생성
    const persona = (await this.personaPromptService.getOne({ personaPromptId: new UniqueEntityId(personaPromptId) }))
      .body;
    const tone = (await this.tonePromptService.getOne({ tonePromptId: new UniqueEntityId(tonePromptId) })).body;
    const context = counselTechnique.context;
    const instruction = counselTechnique.instruction;

    // TODO: contextVariables 처리

    const personaPrompt = `<persona>\n${persona}`;
    const contextPrompt = `<context>\n${context}`;
    const instructionPrompt = `<instruction>\n${instruction}`;
    const tonePrompt = `<tone>\n${tone}`;
    const content = [personaPrompt, contextPrompt, instructionPrompt, tonePrompt].join("\n\n");
    const prompt: LlmRequest = this.llmService.createLlmRequest("system", content);
    prompts.push(prompt);

    // 유저 메시지 생성
    const createdUserMessage = await this.counselMessageService.create({
      counselId: new UniqueEntityId(counsel.id),
      userId: new UniqueEntityId(counsel.userId),
      counselTechniqueId: new UniqueEntityId(counsel.counselTechniqueId),
      message: userMessage,
      isUserMessage: true,
    });
    counselMessages.push(createdUserMessage);

    // 이전 대화 추가
    counselMessages.forEach((counselMessage) => {
      const chatPrompt = this.llmService.createLlmRequest(
        counselMessage.isUserMessage ? "user" : "assistant",
        counselMessage.message,
      );
      prompts.push(chatPrompt);
    });

    // 응답 생성
    const llmResponse = await this.llmService.generateResponse(prompts);
    if (llmResponse.content === null) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, "Generate GPT Response failed");
    }

    // 시스템 메시지 생성
    const createdSystemMessage = await this.counselMessageService.create({
      counselId: new UniqueEntityId(counsel.id),
      userId: new UniqueEntityId(counsel.userId),
      counselTechniqueId: new UniqueEntityId(counsel.counselTechniqueId),
      message: llmResponse.content,
      isUserMessage: false,
    });

    // 상담 정보 최신화
    counsel = await this.counselService.saveLastMessage({
      counselId: new UniqueEntityId(counsel.id),
      lastMessage: createdSystemMessage.message,
    });

    return {
      ok: true,
      counsel,
      createdCounselMessage: createdUserMessage,
      counselorResponseMessage: createdSystemMessage,
    };
  }
}
