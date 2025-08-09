import { CounselSession } from "~counselings/applications/counsel-managements/models/counsel-session";
import {
  BackgroundTechniqueEvaluationResult,
  TechniqueTransitionDecision,
} from "~counselings/applications/counsel-managements/types/technique.type";
import { CounselMessageInfo } from "~counselings/domains/counselMessages/models/counselMessage.info";
import { CounselsService } from "~counselings/domains/counsels/counsels.service";
import { CounselInfo } from "~counselings/domains/counsels/models/counsel.info";
import { CounselTechniquesService } from "~counselings/domains/counselTechniques/counselTechniques.service";
import { CounselTechniqueInfo } from "~counselings/domains/counselTechniques/models/counselTechnique.info";

import { Injectable } from "@nestjs/common";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";

export interface TechniqueManagementResult {
  counsel: CounselInfo;
  currentTechnique: CounselTechniqueInfo;
}

export interface TechniqueEvaluationRequest {
  currentTechnique: CounselTechniqueInfo;
  nextTechnique: CounselTechniqueInfo;
  currentTechniqueMessages: CounselMessageInfo[];
  messageThreshold: number;
}

/**
 * 상담기법 관리를 담당하는 서비스
 * 단일 책임: 상담기법의 조회, 평가 로직, 전환 실행 담당 (도메인 서비스만 사용)
 */
@Injectable()
export class TechniqueManager {
  constructor(
    private readonly counselService: CounselsService,
    private readonly counselTechniqueService: CounselTechniquesService,
  ) {}

  /**
   * 상담기법 조회
   * @param session 상담 세션
   * @returns 관리 결과 (상담 정보, 현재 기법)
   */
  async getCurrentTechnique(session: CounselSession): Promise<TechniqueManagementResult> {
    const counsel = session.getCounsel();

    // 현재 상담기법 조회
    const currentTechnique = await this.counselTechniqueService.getOne({
      counselTechniqueId: new UniqueEntityId(counsel.counselTechniqueId),
    });

    return {
      counsel,
      currentTechnique,
    };
  }

  /**
   * 백그라운드 기법 전환 평가 준비 (AI 평가 제외)
   * @param session 상담 세션
   * @returns 평가 요청 또는 평가 불필요 결과
   */
  async prepareBackgroundEvaluation(
    session: CounselSession,
  ): Promise<
    { shouldEvaluate: false; reason: string } | { shouldEvaluate: true; evaluationRequest: TechniqueEvaluationRequest }
  > {
    try {
      const counsel = session.getCounsel();
      // 현재 기법 조회
      const currentTechnique = await this.counselTechniqueService.getOne({
        counselTechniqueId: new UniqueEntityId(counsel.counselTechniqueId),
      });

      // 다음 기법이 없으면 평가하지 않음
      if (!currentTechnique.nextTechniqueId) {
        return {
          shouldEvaluate: false,
          reason: "No next technique available",
        };
      }

      // 메시지 수 기반 기본 조건 확인
      const currentTechniqueMessages = this.getCurrentTechniqueMessages(
        session.getMessages(),
        counsel.counselTechniqueId,
      );

      const userMessageCount = this.countUserMessagesFromMessages(currentTechniqueMessages);

      // 임계값 이상 메시지가 있어야 AI 평가 수행
      if (userMessageCount < currentTechnique.messageThreshold) {
        return {
          shouldEvaluate: false,
          reason: `Insufficient messages: ${userMessageCount}/${currentTechnique.messageThreshold}`,
        };
      }

      // 다음 기법 조회
      const nextTechnique = await this.counselTechniqueService.getOne({
        counselTechniqueId: new UniqueEntityId(currentTechnique.nextTechniqueId),
      });

      // AI 평가 요청 준비
      return {
        shouldEvaluate: true,
        evaluationRequest: {
          currentTechnique,
          nextTechnique,
          currentTechniqueMessages,
          messageThreshold: currentTechnique.messageThreshold,
        },
      };
    } catch (error) {
      return {
        shouldEvaluate: false,
        reason: `Error during preparation: ${error.message}`,
      };
    }
  }

  /**
   * AI 평가 결과에 따른 기법 전환 처리
   * @param counselId 상담 ID
   * @param decision AI 평가 결과
   * @returns 백그라운드 평가 결과
   */
  async processEvaluationResult(
    techniqueEvaluationRequest: TechniqueEvaluationRequest,
    session: CounselSession,
    decision: TechniqueTransitionDecision,
  ): Promise<BackgroundTechniqueEvaluationResult> {
    try {
      if (decision.shouldTransition) {
        await this.counselService.updateCounselTechniqueId({
          counselId: new UniqueEntityId(session.getCounselId()),
          counselTechniqueId: new UniqueEntityId(techniqueEvaluationRequest.nextTechnique.id),
        });
      }

      return {
        evaluationPerformed: true,
        decision,
      };
    } catch (error) {
      return {
        evaluationPerformed: false,
        error: error.message,
      };
    }
  }

  /**
   * 현재 기법으로 진행된 메시지들만 추출
   * @param messages 전체 메시지 배열
   * @param currentTechniqueId 현재 기법 ID
   * @returns 현재 기법 메시지들
   */
  private getCurrentTechniqueMessages(
    messages: CounselMessageInfo[],
    currentTechniqueId: string,
  ): CounselMessageInfo[] {
    const currentTechniqueMessages = [];

    for (let i = messages.length - 1; i >= 0; i--) {
      const message = messages[i];

      if (message.counselTechniqueId !== currentTechniqueId) {
        break;
      }

      currentTechniqueMessages.unshift(message);
    }

    return currentTechniqueMessages;
  }

  /**
   * 메시지 배열에서 유저 메시지 수 계산
   * @param messages 메시지 배열
   * @returns 유저 메시지 수
   */
  private countUserMessagesFromMessages(messages: CounselMessageInfo[]): number {
    return messages.filter((msg) => msg.isUserMessage).length;
  }
}
