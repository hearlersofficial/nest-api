import { AIResponseGenerator } from "~counselings/applications/counsel-managements/support/ai-response.generator";
import { ContextManager } from "~counselings/applications/counsel-managements/support/context.manager";
import { CounselLockManager } from "~counselings/applications/counsel-managements/support/counsel-lock.manager";
import { CounselTechniquesTransitionExecutor } from "~counselings/applications/counsel-managements/support/counsel-techniques-trainsition.executor";
import { SystemPromptBuilder } from "~counselings/applications/counsel-managements/support/system-prompt.builder";
import { CounselsService } from "~counselings/domains/counsels/counsels.service";
import { CounselMessagesInfo } from "~counselings/domains/counsels/models/counsel-message.info";
import { CounselsInfo } from "~counselings/domains/counsels/models/counsels.info";

import { Injectable, Logger } from "@nestjs/common";
import { FireAndForget } from "~common/shared/utils/fire-and-forget";
import { CounselId } from "~common/shared-kernel/identifiers/counsel.id";
import { Transactional } from "typeorm-transactional";

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
    private readonly counselService: CounselsService,
    private readonly counselTechniquesTransitionExecutor: CounselTechniquesTransitionExecutor,
    private readonly counselLockManager: CounselLockManager,
  ) {}

  /**
   * 상담 진행 - 전체 플로우 오케스트레이션
   * @param request 상담 진행 요청
   * @returns 상담 진행 응답
   */
  @Transactional()
  async proceedCounseling(request: { counselId: CounselId; userMessage: string }): Promise<{
    counsel: CounselsInfo;
    createdCounselMessage: CounselMessagesInfo;
    counselorResponseMessage: CounselMessagesInfo;
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
    const conversationHistory = this.counselService.buildHistory({
      counselId: session.counselId,
      messages: session.messages,
      compressedMessages: session.compressedMessages,
    });

    // 4. AI 응답 생성
    const aiResponse = await this.aiGenerator.generateResponse(
      systemPrompt,
      conversationHistory,
      userMessage,
      session.counselId.getString(),
      session.promptVersion.aiModel,
      session.currentTechnique.temperature,
    );

    // 5. 시스템 메시지 생성 및 저장
    const createdAssistantMessage = await this.counselService.saveMessage({
      counselId: session.counselId,
      message: aiResponse,
      isUserMessage: false,
    });
    session = session.withNewMessage(createdAssistantMessage.message);

    // 6. 백그라운드에서 추가 작업 수행 (상담 맥락을 다루는 별도의 동기적 flow 생성)
    FireAndForget.execute(
      async () => {
        // counsel별 동시성 제어 - 락 획득 시도
        if (!this.counselLockManager.tryAcquire(counselId.getString())) {
          this.logger.debug(`Context processing already in progress: ${counselId.getString()}`);
          return; // 이미 처리 중이면 스킵
        }

        try {
          // 1. 메시지 압축(필요시)
          if (session.counsel.shouldCompressContext) {
            try {
              await this.counselService.compressContext({ counselId: session.counselId });
            } catch {
              // 실패해도 무시하고 계속 진행
            }
          }

          // 2. 상담 맥락 재구성
          try {
            await this.counselService.organizeContext({ counselId: counselId });
          } catch {
            // 실패 시 즉시 종료
            // 맥락분석 실패 -> 기법전환 불필요 -> 종료
            return;
          }

          // 3. 세션 최신화
          const updatedSession = await this.contextManager.buildCounselSession(counselId);

          // 4. 최신화된 세션으로 상담 기법 전환 시도
          try {
            await this.counselTechniquesTransitionExecutor.executeTransitionIfPossible(updatedSession);
          } catch {
            // 실패 시 무시하고 종료
            // 기법전환 실패 -> 종료
            return;
          }
        } finally {
          // 락 해제
          this.counselLockManager.release(counselId.getString());
        }
      },
      {
        context: `Organize context and technique transition: ${counselId.getString()}`,
      },
    );

    return {
      counsel: session.counsel,
      createdCounselMessage: createdUserMessage.message,
      counselorResponseMessage: createdAssistantMessage.message,
    };
  }
}
