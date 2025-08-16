import { CounselSession } from "~counselings/applications/counsel-managements/models/counsel-session";
import { AIResponseGenerator } from "~counselings/applications/counsel-managements/support/ai-response.generator";
import { ContextManager } from "~counselings/applications/counsel-managements/support/context.manager";
import { SystemPromptBuilder } from "~counselings/applications/counsel-managements/support/system-prompt.builder";
import { TechniqueEvaluationParser } from "~counselings/applications/counsel-managements/support/technique-evaluation.parser";
import { TechniqueTransitionDecision } from "~counselings/applications/counsel-managements/types/technique.type";
import { CounselsService } from "~counselings/domains/counsels/counsels.service";
import { CounselInfo } from "~counselings/domains/counsels/models/counsel.info";
import { CounselMessageInfo } from "~counselings/domains/counsels/models/counsel-message.info";
import { CounselTechniquesService } from "~counselings/domains/counselTechniques/counselTechniques.service";
import { AiModel } from "~proto/com/hearlers/v1/model/counsel_prompt_pb";

import { HttpStatus, Injectable, Logger } from "@nestjs/common";
import { isDefined } from "~common/shared/utils/validate";
import { CounselId } from "~common/shared-kernel/identifiers/counsel.id";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";
import { Propagation, Transactional } from "typeorm-transactional";

/**
 * 상담 진행의 전체 흐름을 관리하는 메인 오케스트레이터 서비스
 * 단일 책임: 상담 진행 플로우의 전체적인 조율과 관리
 */
@Injectable()
export class CounselingOrchestrator {
  private readonly logger = new Logger(CounselingOrchestrator.name);

  constructor(
    private readonly promptBuilder: SystemPromptBuilder,
    private readonly aiGenerator: AIResponseGenerator,
    private readonly contextManager: ContextManager,
    private readonly techniqueEvaluationParser: TechniqueEvaluationParser,
    private readonly counselService: CounselsService,
    private readonly counselTechniqueService: CounselTechniquesService,
  ) {}

  /**
   * 상담 진행 - 전체 플로우 오케스트레이션
   * @param request 상담 진행 요청
   * @returns 상담 진행 응답
   */
  @Transactional()
  async proceedCounseling(request: { counselId: CounselId; userMessage: string }): Promise<{
    counsel: CounselInfo;
    createdCounselMessage: CounselMessageInfo;
    counselorResponseMessage: CounselMessageInfo;
  }> {
    const { counselId, userMessage } = request;

    // 1. 유저 메시지 생성 및 저장
    const createdUserMessage = await this.counselService.saveMessage({
      counselId,
      message: userMessage,
      isUserMessage: true,
    });

    // 2. 세션 컨텍스트 구성
    let session = await this.contextManager.buildCounselSession(counselId);

    // 3. 프롬프트 구성
    const systemPrompt = await this.promptBuilder.buildSystemPrompt(session);
    let conversationHistory = this.counselService.buildHistory({
      counselId: session.getCounselId(),
      messages: session.getMessages(),
      compressedMessages: session.getCompressedMessages(),
    });

    // 4. AI 응답 생성
    const aiResponse = await this.aiGenerator.generateResponse(
      systemPrompt,
      conversationHistory,
      userMessage,
      session.getCounselId().getString(),
      session.getPromptVersion().aiModel,
      session.getCurrentTechnique().temperature,
    );

    // 5. 시스템 메시지 생성 및 저장
    const createdAssistantMessage = await this.counselService.saveMessage({
      counselId: session.getCounselId(),
      message: aiResponse,
      isUserMessage: false,
    });
    session = session.withNewMessage(createdAssistantMessage.message);

    conversationHistory = this.counselService.buildHistory({
      counselId: session.getCounselId(),
      messages: session.getMessages(),
      compressedMessages: session.getCompressedMessages(),
    });

    // 6. 백그라운드에서 기법 전환 평가 수행
    this.evaluateTechniqueTransitionInBackground(session);

    return {
      counsel: session.getCounsel(),
      createdCounselMessage: createdUserMessage.message,
      counselorResponseMessage: createdAssistantMessage.message,
    };
  }

  /**
   * 백그라운드에서 기법 전환 평가 및 실행
   * @param session 상담 세션
   * @param latestMessage 최신 메시지
   */
  @Transactional({ propagation: Propagation.REQUIRES_NEW })
  private evaluateTechniqueTransitionInBackground(session: CounselSession): void {
    // 백그라운드 처리를 위해 Promise.resolve()를 사용
    Promise.resolve()
      .then(async () => {
        // 1. 평가 조건 확인
        if (!isDefined(session.getCurrentTechnique().nextTechniqueId)) {
          this.logger.log(`Technique evaluation skipped for counsel ${session.getCounselId()}: No next technique`);
          return;
        }
        if (
          session
            .getMessages()
            .filter((m) => m.isUserMessage)
            .filter((m) => m.counselTechniqueId.equals(session.getCurrentTechniqueId())).length <
          session.getCurrentTechnique().messageThreshold
        ) {
          this.logger.log(`Technique evaluation skipped for counsel ${session.getCounselId()}: Insufficient messages`);
          return;
        }

        // 2. AI 평가 수행
        const decision = await this.performAIEvaluation(session);

        // 3. 기법 전환 처리
        if (decision.shouldTransition) {
          await this.counselService.updateCounselTechniqueId({
            counselId: session.getCounselId(),
            counselTechniqueId: session.getCurrentTechnique().nextTechniqueId!,
          });
        }

        // 로깅
        if (decision.shouldTransition) {
          this.logger.log(`Technique transition executed for counsel ${session.getCounselId()}`, {
            currentTechniqueId: session.getCurrentTechniqueId(),
            scores: decision.scores,
            confidence: decision.confidence,
          });
        } else {
          this.logger.log(`Technique transition not recommended for counsel ${session.getCounselId()}`, {
            currentTechniqueId: session.getCurrentTechniqueId(),
            scores: decision.scores,
            confidence: decision.confidence,
          });
        }
      })
      .catch((error) => {
        this.logger.error(`Error in background technique evaluation for counsel ${session.getCounselId()}`, error);
      });
  }

  /**
   * AI 평가 수행 (support 서비스들 활용)
   * @param request 평가 요청
   * @returns 기법 전환 결정
   */
  private async performAIEvaluation(session: CounselSession): Promise<TechniqueTransitionDecision> {
    // 현재 기법 메시지들을 대화 히스토리로 구성
    const conversationHistory = this.counselService.buildHistory({
      counselId: session.getCounselId(),
      messages: session.getMessages(),
      compressedMessages: session.getCompressedMessages(),
    });
    const nextTechniqueId = session.getCurrentTechnique().nextTechniqueId;

    if (!isDefined(nextTechniqueId)) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, "Next technique not found");
    }

    const nextTechnique = await this.counselTechniqueService.getOne({
      counselTechniqueId: nextTechniqueId,
    });

    // 기법 평가용 통합 시스템 프롬프트 생성
    const systemPrompt = this.promptBuilder.buildTechniqueEvaluationSystemPrompt({
      currentTechnique: session.getCurrentTechnique(),
      nextTechnique: nextTechnique,
      messageThreshold: session.getCurrentTechnique().messageThreshold,
    });

    const evaluationRequest = "please evaluate the technique transition";

    // AI 평가 수행
    const aiResponse = await this.aiGenerator.generateResponse(
      systemPrompt,
      conversationHistory,
      evaluationRequest,
      `technique-evaluation-${Date.now()}`,
      AiModel.GPT_4O,
      0,
    );

    const userMessageCount = session.getMessages().filter((m) => m.isUserMessage).length;

    // 파서를 사용하여 응답 파싱 + 결정 계산
    return this.techniqueEvaluationParser.parseTechniqueEvaluationResponse(aiResponse, {
      messageThreshold: session.getCurrentTechnique().messageThreshold,
      userMessageCount,
    });
  }
}
