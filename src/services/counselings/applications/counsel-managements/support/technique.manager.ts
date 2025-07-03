import {
  TechniqueChangeCheckParams,
  TechniqueResetCheckParams,
  TechniqueUpdateParams,
} from "~counselings/applications/counsel-managements/types/technique.type";
import { CounselMessageInfo } from "~counselings/domains/counselMessages/models/counselMessage.info";
import { CounselsService } from "~counselings/domains/counsels/counsels.service";
import { CounselInfo } from "~counselings/domains/counsels/models/counsel.info";
import { CounselTechniquesService } from "~counselings/domains/counselTechniques/counselTechniques.service";
import { CounselTechniqueInfo } from "~counselings/domains/counselTechniques/models/counselTechnique.info";

import { Injectable } from "@nestjs/common";
import { getNowDayjs } from "~common/shared/utils/date";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";
import { Dayjs } from "dayjs";

export interface TechniqueManagementParams {
  counsel: CounselInfo;
  messages: CounselMessageInfo[];
  firstCounselTechniqueId: string;
  timeDurationForReset: number;
}

export interface TechniqueManagementResult {
  counsel: CounselInfo;
  currentTechnique: CounselTechniqueInfo;
  hasChanged: boolean;
}

/**
 * 상담기법 관리를 담당하는 서비스
 * 단일 책임: 상담기법의 초기화, 변경, 전환 로직만 담당
 */
@Injectable()
export class TechniqueManager {
  constructor(
    private readonly counselService: CounselsService,
    private readonly counselTechniqueService: CounselTechniquesService,
  ) {}

  /**
   * 상담기법 전체 관리 (초기화 + 변경 체크)
   * @param params 기법 관리 파라미터
   * @returns 관리 결과 (상담 정보, 현재 기법, 변경 여부)
   */
  async manageTechnique(params: TechniqueManagementParams): Promise<TechniqueManagementResult> {
    let { counsel } = params;
    let hasChanged = false;

    // 1. 시간 기반 초기화 체크
    const shouldReset = this.shouldResetTechnique({
      lastMessageTime: this.getLastMessageTime(params.messages),
      timeDurationForReset: params.timeDurationForReset,
    });

    if (shouldReset) {
      counsel = await this.resetToFirstTechnique(counsel, params.firstCounselTechniqueId);
      hasChanged = true;
    }

    // 2. 현재 상담기법 조회
    let currentTechnique = await this.counselTechniqueService.getOne({
      counselTechniqueId: new UniqueEntityId(counsel.counselTechniqueId),
    });

    // 3. 메시지 수 기반 변경 체크
    const shouldChange = this.shouldChangeTechnique({
      messages: params.messages,
      currentTechniqueId: counsel.counselTechniqueId,
      messageThreshold: currentTechnique.messageThreshold,
    });

    if (shouldChange && currentTechnique.nextTechniqueId) {
      const nextTechnique = await this.counselTechniqueService.getOne({
        counselTechniqueId: new UniqueEntityId(currentTechnique.nextTechniqueId),
      });

      counsel = await this.updateCounselTechnique({
        counselId: new UniqueEntityId(counsel.id),
        newTechniqueId: new UniqueEntityId(nextTechnique.id),
      });

      currentTechnique = nextTechnique;
      hasChanged = true;
    }

    return {
      counsel,
      currentTechnique,
      hasChanged,
    };
  }

  /**
   * 시간 기반 상담기법 초기화 여부 확인
   * @param params 초기화 체크 파라미터
   * @returns 초기화 필요 여부
   */
  private shouldResetTechnique(params: TechniqueResetCheckParams): boolean {
    const now = getNowDayjs();
    const timeDiff = now.diff(params.lastMessageTime);
    return timeDiff > params.timeDurationForReset;
  }

  /**
   * 메시지 수 기반 상담기법 변경 여부 확인
   * @param params 변경 체크 파라미터
   * @returns 변경 필요 여부
   */
  private shouldChangeTechnique(params: TechniqueChangeCheckParams): boolean {
    const messageCountAtCurrentTechnique = this.countMessagesForCurrentTechnique(
      params.messages,
      params.currentTechniqueId,
    );

    return messageCountAtCurrentTechnique >= params.messageThreshold;
  }

  /**
   * 현재 상담기법에서의 유저 메시지 수 계산
   * @param messages 메시지 배열
   * @param currentTechniqueId 현재 상담기법 ID
   * @returns 메시지 수
   */
  private countMessagesForCurrentTechnique(messages: CounselMessageInfo[], currentTechniqueId: string): number {
    let count = 0;

    for (let i = messages.length - 1; i >= 0; i--) {
      const message = messages[i];

      if (!message.isUserMessage) {
        continue;
      }

      if (message.counselTechniqueId !== currentTechniqueId) {
        break;
      }

      count++;
    }

    return count;
  }

  /**
   * 첫 번째 상담기법으로 초기화
   * @param counsel 상담 정보
   * @param firstTechniqueId 첫 번째 상담기법 ID
   * @returns 업데이트된 상담 정보
   */
  private async resetToFirstTechnique(counsel: CounselInfo, firstTechniqueId: string): Promise<CounselInfo> {
    return this.counselService.updateCounselTechniqueId({
      counselId: new UniqueEntityId(counsel.id),
      counselTechniqueId: new UniqueEntityId(firstTechniqueId),
    });
  }

  /**
   * 상담기법 업데이트
   * @param params 업데이트 파라미터
   * @returns 업데이트된 상담 정보
   */
  private async updateCounselTechnique(params: TechniqueUpdateParams): Promise<CounselInfo> {
    return this.counselService.updateCounselTechniqueId({
      counselId: params.counselId,
      counselTechniqueId: params.newTechniqueId,
    });
  }

  /**
   * 마지막 메시지 시간 추출
   * @param messages 메시지 배열
   * @returns 마지막 메시지 시간
   */
  private getLastMessageTime(messages: CounselMessageInfo[]): Dayjs {
    if (messages.length === 0) {
      return getNowDayjs(); // 메시지가 없으면 현재 시간 반환
    }

    return messages[messages.length - 1].createdAt;
  }
}
