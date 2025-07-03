import { CounselSession } from "~counselings/applications/counsel-managements/models/counsel-session";
import { AIResponseGenerator } from "~counselings/applications/counsel-managements/support/ai-response.generator";
import { ConversationHistoryBuilder } from "~counselings/applications/counsel-managements/support/conversation-history.builder";
import { MessageManager } from "~counselings/applications/counsel-managements/support/message.manager";
import { SystemPromptBuilder } from "~counselings/applications/counsel-managements/support/system-prompt.builder";
import { TechniqueManager } from "~counselings/applications/counsel-managements/support/technique.manager";
import { CounselMessageInfo } from "~counselings/domains/counselMessages/models/counselMessage.info";
import { CounselorsService } from "~counselings/domains/counselors/counselors.service";
import { CounselsService } from "~counselings/domains/counsels/counsels.service";
import { CounselInfo } from "~counselings/domains/counsels/models/counsel.info";
import { CounselTechniquesService } from "~counselings/domains/counselTechniques/counselTechniques.service";
import { PromptVersionsService } from "~counselings/domains/promptVersions/promptVersions.service";

import { Injectable } from "@nestjs/common";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";

/**
 * 상담 진행의 전체 흐름을 관리하는 메인 오케스트레이터 서비스
 * 단일 책임: 상담 진행 플로우의 전체적인 조율과 관리
 */
@Injectable()
export class CounselingOrchestrator {
  private readonly TIME_DURATION_FOR_PROMPT_RESET = 1000 * 60 * 60 * 6; // 6 hours

  constructor(
    // 도메인 서비스들
    private readonly counselService: CounselsService,
    private readonly counselorService: CounselorsService,
    private readonly promptVersionsService: PromptVersionsService,
    private readonly counselTechniqueService: CounselTechniquesService,

    // 애플리케이션 서비스들
    private readonly techniqueManager: TechniqueManager,
    private readonly promptBuilder: SystemPromptBuilder,
    private readonly historyBuilder: ConversationHistoryBuilder,
    private readonly messageManager: MessageManager,
    private readonly aiGenerator: AIResponseGenerator,
  ) {}

  /**
   * 상담 진행 - 전체 플로우 오케스트레이션
   * @param request 상담 진행 요청
   * @returns 상담 진행 응답
   */
  async proceedCounseling(request: { counselId: UniqueEntityId; userMessage: string }): Promise<{
    counsel: CounselInfo;
    createdCounselMessage: CounselMessageInfo;
    counselorResponseMessage: CounselMessageInfo;
  }> {
    const { counselId, userMessage } = request;

    // 1. 세션 컨텍스트 구성
    let session = await this.buildCounselSession(counselId);

    // 2. 상담기법 관리 (초기화 + 변경 체크)
    const techniqueResult = await this.techniqueManager.manageTechnique({
      counsel: session.getCounsel(),
      messages: session.getMessages(),
      firstCounselTechniqueId: session.getToneScopedPrompt().firstCounselTechniqueId,
      timeDurationForReset: this.TIME_DURATION_FOR_PROMPT_RESET,
    });

    // 세션 업데이트 (상담 정보 + 상담기법)
    session = session
      .withUpdatedCounsel(techniqueResult.counsel)
      .withUpdatedTechnique(techniqueResult.currentTechnique);

    // 3. 시스템 프롬프트 생성
    const systemPrompt = await this.promptBuilder.buildSystemPrompt({
      personaPromptId: session.getCounselorScopedPrompt().personaPromptId,
      tonePromptId: session.getToneScopedPrompt().tonePromptId,
      counselTechnique: session.getCurrentTechnique(),
    });

    // 4. 유저 메시지 생성 및 저장
    const createdUserMessage = await this.messageManager.createUserMessage({
      counselId: new UniqueEntityId(session.getCounselId()),
      userId: new UniqueEntityId(session.getUserId()),
      counselTechniqueId: new UniqueEntityId(session.getCurrentTechniqueId()),
      message: userMessage,
    });

    // 세션에 새 메시지 추가
    session = session.withNewMessage(createdUserMessage);

    // 5. 대화 히스토리 구성
    const conversationHistory = this.historyBuilder.buildHistory(session.getMessages());

    // 6. AI 응답 생성
    const aiResponse = await this.aiGenerator.generateResponse(
      systemPrompt,
      conversationHistory,
      userMessage,
      session.getCounselId(),
    );

    // 7. 시스템 메시지 생성 및 저장
    const createdSystemMessage = await this.messageManager.createSystemMessage({
      counselId: new UniqueEntityId(session.getCounselId()),
      userId: new UniqueEntityId(session.getUserId()),
      counselTechniqueId: new UniqueEntityId(session.getCurrentTechniqueId()),
      message: aiResponse,
    });

    // 8. 상담 정보 업데이트 (마지막 메시지)
    const updatedCounsel = await this.messageManager.updateLastMessage({
      counselId: new UniqueEntityId(session.getCounselId()),
      lastMessage: createdSystemMessage.message,
    });

    return {
      counsel: updatedCounsel,
      createdCounselMessage: createdUserMessage,
      counselorResponseMessage: createdSystemMessage,
    };
  }

  /**
   * 상담 세션 컨텍스트 구성
   * @param counselId 상담 ID
   * @returns 구성된 CounselSession 인스턴스
   */
  private async buildCounselSession(counselId: UniqueEntityId): Promise<CounselSession> {
    // 병렬로 데이터 수집
    const [counsel, counselMessages] = await Promise.all([
      this.counselService.getOne({ counselId }),
      this.messageManager.getCounselMessages(counselId),
    ]);

    const [counselor, promptVersion, currentTechnique] = await Promise.all([
      this.counselorService.getOne({ counselorId: new UniqueEntityId(counsel.counselorId) }),
      this.promptVersionsService.getOne({ promptVersionId: new UniqueEntityId(counsel.promptVersionId) }),
      this.counselTechniqueService.getOne({ counselTechniqueId: new UniqueEntityId(counsel.counselTechniqueId) }),
    ]);

    return new CounselSession({
      counsel,
      counselor,
      messages: counselMessages,
      promptVersion,
      currentTechnique,
    });
  }
}
