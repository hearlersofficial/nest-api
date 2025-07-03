import {
  CreateSystemMessageParams,
  CreateUserMessageParams,
  UpdateLastMessageParams,
} from "~counselings/applications/counsel-managements/types/message.type";
import { CounselMessagesService } from "~counselings/domains/counselMessages/counselMessages.service";
import { CounselMessageInfo } from "~counselings/domains/counselMessages/models/counselMessage.info";
import { CounselsService } from "~counselings/domains/counsels/counsels.service";
import { CounselInfo } from "~counselings/domains/counsels/models/counsel.info";

import { Injectable } from "@nestjs/common";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";

/**
 * 메시지 생성/저장을 담당하는 서비스
 * 단일 책임: 상담 메시지의 CRUD 작업만 담당
 */
@Injectable()
export class MessageManager {
  constructor(
    private readonly counselMessageService: CounselMessagesService,
    private readonly counselService: CounselsService,
  ) {}

  /**
   * 유저 메시지 생성
   * @param params 유저 메시지 생성 파라미터
   * @returns 생성된 유저 메시지
   */
  async createUserMessage(params: CreateUserMessageParams): Promise<CounselMessageInfo> {
    return this.counselMessageService.create({
      counselId: params.counselId,
      userId: params.userId,
      counselTechniqueId: params.counselTechniqueId,
      message: params.message,
      isUserMessage: true,
    });
  }

  /**
   * 시스템(AI) 메시지 생성
   * @param params 시스템 메시지 생성 파라미터
   * @returns 생성된 시스템 메시지
   */
  async createSystemMessage(params: CreateSystemMessageParams): Promise<CounselMessageInfo> {
    return this.counselMessageService.create({
      counselId: params.counselId,
      userId: params.userId,
      counselTechniqueId: params.counselTechniqueId,
      message: params.message,
      isUserMessage: false,
    });
  }

  /**
   * 상담의 마지막 메시지 업데이트
   * @param params 마지막 메시지 업데이트 파라미터
   * @returns 업데이트된 상담 정보
   */
  async updateLastMessage(params: UpdateLastMessageParams): Promise<CounselInfo> {
    return this.counselService.saveLastMessage({
      counselId: params.counselId,
      lastMessage: params.lastMessage,
    });
  }

  /**
   * 특정 상담의 모든 메시지 조회
   * @param counselId 상담 ID
   * @returns 메시지 배열
   */
  async getCounselMessages(counselId: UniqueEntityId): Promise<CounselMessageInfo[]> {
    return this.counselMessageService.getMany({ counselId });
  }
}
