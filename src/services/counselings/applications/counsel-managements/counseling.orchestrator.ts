import { CounselSession } from "~counselings/applications/counsel-managements/models/counsel-session";
import { AIResponseGenerator } from "~counselings/applications/counsel-managements/support/ai-response.generator";
import {
  CompressedContextManager,
  ContextCompressRequest,
} from "~counselings/applications/counsel-managements/support/compressed-context.manager";
import { ContextManager } from "~counselings/applications/counsel-managements/support/context.manager";
import { ConversationHistoryBuilder } from "~counselings/applications/counsel-managements/support/conversation-history.builder";
import { MessageManager } from "~counselings/applications/counsel-managements/support/message.manager";
import { SystemPromptBuilder } from "~counselings/applications/counsel-managements/support/system-prompt.builder";
import {
  TechniqueEvaluationRequest,
  TechniqueManager,
} from "~counselings/applications/counsel-managements/support/technique.manager";
import { TechniqueEvaluationParser } from "~counselings/applications/counsel-managements/support/technique-evaluation.parser";
import { TechniqueTransitionDecision } from "~counselings/applications/counsel-managements/types/technique.type";
import { CounselMessageInfo } from "~counselings/domains/counselMessages/models/counselMessage.info";
import { CounselInfo } from "~counselings/domains/counsels/models/counsel.info";

import { Injectable, Logger } from "@nestjs/common";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";
import { Propagation, Transactional } from "typeorm-transactional";

/**
 * 상담 진행의 전체 흐름을 관리하는 메인 오케스트레이터 서비스
 * 단일 책임: 상담 진행 플로우의 전체적인 조율과 관리
 */
@Injectable()
export class CounselingOrchestrator {
  private readonly logger = new Logger(CounselingOrchestrator.name);

  constructor(
    // 애플리케이션 서비스들
    private readonly techniqueManager: TechniqueManager,
    private readonly promptBuilder: SystemPromptBuilder,
    private readonly historyBuilder: ConversationHistoryBuilder,
    private readonly messageManager: MessageManager,
    private readonly aiGenerator: AIResponseGenerator,
    private readonly contextManager: ContextManager,
    private readonly techniqueEvaluationParser: TechniqueEvaluationParser,
    private readonly compressedContextManager: CompressedContextManager,
  ) {}

  /**
   * 상담 진행 - 전체 플로우 오케스트레이션
   * @param request 상담 진행 요청
   * @returns 상담 진행 응답
   */
  @Transactional()
  async proceedCounseling(request: { counselId: UniqueEntityId; userMessage: string }): Promise<{
    counsel: CounselInfo;
    createdCounselMessage: CounselMessageInfo;
    counselorResponseMessage: CounselMessageInfo;
  }> {
    const { counselId, userMessage } = request;

    // 1. 세션 컨텍스트 구성
    let session = await this.contextManager.buildCounselSession(counselId);

    // 2. 현재 상담기법 조회
    const techniqueResult = await this.techniqueManager.getCurrentTechnique({
      counsel: session.getCounsel(),
      messages: session.getMessages(),
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

    // 5. 대화 히스토리 구성 (압축된 맥락 포함)
    // TODO: 압축된 메시지들도 포함할지 여부 결정
    const conversationHistory = this.historyBuilder.buildHistory(
      session.getMessages(),
      session.getCompressedContexts(),
    );

    // 6. AI 응답 생성
    const aiResponse = await this.aiGenerator.generateResponse(
      systemPrompt,
      conversationHistory,
      userMessage,
      session.getCounselId(),
    );

    // 7. 시스템 메시지 생성 및 저장
    const createdAssistantMessage = await this.messageManager.createAssistantMessage({
      counselId: new UniqueEntityId(session.getCounselId()),
      userId: new UniqueEntityId(session.getUserId()),
      counselTechniqueId: new UniqueEntityId(session.getCurrentTechniqueId()),
      message: aiResponse,
    });
    session = session.withNewMessage(createdAssistantMessage);

    // 8. 상담 정보 업데이트 (마지막 메시지)
    const updatedCounsel = await this.messageManager.updateLastMessage({
      counselId: new UniqueEntityId(session.getCounselId()),
      lastMessage: createdAssistantMessage.message,
    });
    session = session.withUpdatedCounsel(updatedCounsel);

    // 9. 백그라운드에서 기법 전환 평가 수행
    this.evaluateTechniqueTransitionInBackground(session);

    // 10. 백그라운드에서 상담 맥락 압축 수행
    this.compressContextInBackground(session);

    return {
      counsel: updatedCounsel,
      createdCounselMessage: createdUserMessage,
      counselorResponseMessage: createdAssistantMessage,
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
        // 1. TechniqueManager에서 평가 준비 (도메인 로직만 사용)
        const preparationResult = await this.techniqueManager.prepareBackgroundEvaluation({
          counsel: session.getCounsel(),
          messages: session.getMessages(),
        });

        // 평가가 불필요한 경우
        if (!preparationResult.shouldEvaluate) {
          this.logger.log(
            `Technique evaluation skipped for counsel ${session.getCounselId()}: ${preparationResult.reason}`,
          );
          return;
        }

        // 2. AI 평가 수행
        const decision = await this.performAIEvaluation(preparationResult.evaluationRequest);

        // 3. TechniqueManager에서 평가 결과 처리
        const evaluationResult = await this.techniqueManager.processEvaluationResult(
          preparationResult.evaluationRequest,
          session,
          decision,
        );

        // 로깅
        if (evaluationResult.evaluationPerformed && decision.shouldTransition) {
          this.logger.log(`Technique transition executed for counsel ${session.getCounselId()}`, {
            currentTechniqueId: session.getCurrentTechniqueId(),
            scores: decision.scores,
            confidence: decision.confidence,
          });
        } else if (evaluationResult.evaluationPerformed) {
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
  private async performAIEvaluation(request: TechniqueEvaluationRequest): Promise<TechniqueTransitionDecision> {
    // 현재 기법 메시지들을 대화 히스토리로 구성
    const conversationHistory = this.historyBuilder.buildHistory(request.currentTechniqueMessages);
    // 기법 평가용 통합 시스템 프롬프트 생성
    const systemPrompt = this.promptBuilder.buildTechniqueEvaluationSystemPrompt({
      currentTechnique: request.currentTechnique,
      nextTechnique: request.nextTechnique,
      messageThreshold: request.messageThreshold,
    });

    // 간단한 평가 요청 메시지
    const evaluationRequest = `현재 기법에서 다음 기법으로 전환해야 하는지 평가해주세요. 
현재 기법으로 진행된 메시지 수: ${request.currentTechniqueMessages.length}개`;

    // AI 평가 수행
    const aiResponse = await this.aiGenerator.generateResponse(
      systemPrompt,
      conversationHistory,
      evaluationRequest,
      `technique-evaluation-${Date.now()}`,
    );
    // 파서를 사용하여 응답 파싱
    return this.techniqueEvaluationParser.parseTechniqueEvaluationResponse(aiResponse);
  }

  /**
   * 백그라운드에서 상담 맥락 압축 작업 수행
   * @param session 상담 세션
   */
  @Transactional({ propagation: Propagation.REQUIRES_NEW })
  private compressContextInBackground(session: CounselSession): void {
    // 백그라운드 처리를 위해 Promise.resolve()를 사용
    Promise.resolve()
      .then(async () => {
        // 1. 상담 맥락 압축 필요 여부 확인
        const prepareResult = await this.compressedContextManager.prepareBackgroundCompression({
          counsel: session.getCounsel(),
        });

        // 압축이 불필요한 경우
        if (!prepareResult.shouldCompress) {
          this.logger.log(`Context compression skipped for counsel ${session.getCounselId()}: ${prepareResult.reason}`);
          return;
        }

        // 2. AI 압축 수행
        const compressedContext = await this.performAIContextCompression(prepareResult.request);

        // 3. 압축 결과 처리
        const compressionResult = await this.compressedContextManager.processContextCompression(prepareResult.request, {
          compressedContext,
          messageCountAtCompression: session.getCounsel().messageCount,
        });

        // 로깅
        if (compressionResult.compressionPerformed && compressionResult.compressedContext) {
          this.logger.log(`Context compression performed for counsel ${session.getCounselId()}`, {
            compressedContextId: compressionResult.compressedContext.id,
            messageCountAtCompression: compressionResult.compressedContext.messageCountAtCompression,
          });
        }
      })
      .catch((error) => {
        this.logger.error(`Error in background context compression for counsel ${session.getCounselId()}`, error);
      });
  }

  /**
   * AI를 사용하여 상담 맥락을 압축하는 로직
   * @param session 상담 세션
   * @returns 압축된 컨텍스트 문자열
   */
  private async performAIContextCompression(request: ContextCompressRequest): Promise<string> {
    // 압축하려는 메시지 및 맥락 히스토리 구성
    const conversationHistory = this.historyBuilder.buildHistory(
      request.messagesToCompress,
      request.existingCompressedContexts,
    );
    const systemPrompt = this.promptBuilder.buildContextCompressionSystemPrompt();

    const compressionRequest = "현재 메시지 및 컨텍스트를 압축해주세요.";

    // AI 압축 수행
    const aiResponse = await this.aiGenerator.generateResponse(
      systemPrompt,
      conversationHistory,
      compressionRequest,
      `context-compression-${Date.now()}`,
    );

    return aiResponse;
  }
}
