import { AIResponseGenerator } from "~counselings/applications/counsel-managements/support/ai-response.generator";
import { ContextManager } from "~counselings/applications/counsel-managements/support/context.manager";
import {
  CounselLockManager,
  LockType,
} from "~counselings/applications/counsel-managements/support/counsel-lock.manager";
import { CounselTechniquesTransitionExecutor } from "~counselings/applications/counsel-managements/support/counsel-techniques-trainsition.executor";
import { SystemPromptBuilder } from "~counselings/applications/counsel-managements/support/system-prompt.builder";
import { CounselsService } from "~counselings/domains/counsels/counsels.service";
import { CounselMessagesInfo } from "~counselings/domains/counsels/models/counsel-message.info";
import { CounselsInfo } from "~counselings/domains/counsels/models/counsels.info";

import { HttpStatus, Injectable, Logger } from "@nestjs/common";
import { FireAndForget } from "~common/shared/utils/fire-and-forget";
import { CounselId } from "~common/shared-kernel/identifiers/counsel.id";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";
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

    // 메인 플로우 동시성 제어 - 락 획득
    if (!this.counselLockManager.tryAcquire(counselId.getString(), LockType.MAIN_FLOW)) {
      throw new HttpStatusBasedRpcException(
        HttpStatus.TOO_MANY_REQUESTS,
        `상담 진행이 이미 처리 중입니다: ${counselId.getString()}`,
      );
    }

    try {
      // 1. 유저 메시지 생성 및 저장
      const createdUserMessage = await this.counselService.saveMessage({
        counselId,
        message: userMessage,
        isUserMessage: true,
      });

      // 2. 세션 컨텍스트 구성
      const session = await this.contextManager.buildCounselSession(counselId);

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

      // 메인 플로우 완료 후 백그라운드 작업 시작
      this.startBackgroundProcessing(counselId);

      return {
        counsel: session.counsel,
        createdCounselMessage: createdUserMessage.message,
        counselorResponseMessage: createdAssistantMessage.message,
      };
    } finally {
      // 메인 플로우 락 해제
      this.counselLockManager.release(counselId.getString(), LockType.MAIN_FLOW);
    }
  }

  /**
   * 백그라운드 처리 시작 (메인 플로우와 분리)
   */
  private startBackgroundProcessing(counselId: CounselId): void {
    // 1. 메시지 압축로직 실행(백그라운드)
    FireAndForget.execute(
      async () => {
        // counsel별 동시성 제어 - 락 획득 시도
        if (!this.counselLockManager.tryAcquire(counselId.getString(), LockType.COMPRESSION)) {
          this.logger.debug(`Compression processing already in progress: ${counselId.getString()}`);
          return; // 이미 처리 중이면 스킵
        }

        try {
          try {
            await this.counselService.compressContext({ counselId });
          } catch {
            // 실패해도 무시
          }
        } finally {
          // 락 해제
          this.counselLockManager.release(counselId.getString(), LockType.COMPRESSION);
        }
      },
      {
        context: `Compress context: ${counselId.getString()}`,
      },
    );

    // 2. 상담 맥락 분석 및 기법 전환 시도(백그라운드) - 동기적 수행
    FireAndForget.execute(
      async () => {
        // counsel별 동시성 제어 - 락 획득 시도
        if (!this.counselLockManager.tryAcquire(counselId.getString(), LockType.ANALYSIS_TRANSITION)) {
          this.logger.debug(`Analysis and Transition processing already in progress: ${counselId.getString()}`);
          return; // 이미 처리 중이면 스킵
        }

        try {
          // 1. 상담 맥락 분석
          try {
            await this.counselService.organizeContext({ counselId });
          } catch (error) {
            // 맥락 분석 실패 시 기법 전이도 수행하지 않음
            return;
          }

          // 2. 세션 최신화 (분석 결과 및 현재 상담 메시지 카운트 반영)
          const updatedSession = await this.contextManager.buildCounselSession(counselId);

          // 3. 상담 기법 전환 시도
          try {
            await this.counselTechniquesTransitionExecutor.executeTransitionIfPossible(updatedSession);
          } catch (error) {
            // 실패해도 무시
          }
        } finally {
          // 락 해제
          this.counselLockManager.release(counselId.getString(), LockType.ANALYSIS_TRANSITION);
        }
      },
      {
        context: `Analyze context and technique transition: ${counselId.getString()}`,
      },
    );
  }
}
