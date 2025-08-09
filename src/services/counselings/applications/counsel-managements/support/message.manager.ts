import { CounselSession } from "~counselings/applications/counsel-managements/models/counsel-session";
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
   * @param session 상담 세션
   * @param message 유저 메시지
   * @returns 생성된 유저 메시지
   */
  async createUserMessage(session: CounselSession, message: string): Promise<CounselMessageInfo> {
    const createdMessage = await this.counselMessageService.create({
      counselId: new UniqueEntityId(session.getCounselId()),
      userId: new UniqueEntityId(session.getUserId()),
      counselTechniqueId: new UniqueEntityId(session.getCurrentTechniqueId()),
      message,
      isUserMessage: true,
    });
    await this.counselService.increaseMessageCount({ counselId: new UniqueEntityId(session.getCounselId()) });

    return createdMessage;
  }

  /**
   * 어시스턴트(AI) 메시지 생성
   * @param session 상담 세션
   * @param message AI 메시지
   * @returns 생성된 어시스턴트 메시지
   */
  async createAssistantMessage(session: CounselSession, message: string): Promise<CounselMessageInfo> {
    const createdMessage = await this.counselMessageService.create({
      counselId: new UniqueEntityId(session.getCounselId()),
      userId: new UniqueEntityId(session.getUserId()),
      counselTechniqueId: new UniqueEntityId(session.getCurrentTechniqueId()),
      message,
      isUserMessage: false,
    });
    await this.counselService.increaseMessageCount({ counselId: new UniqueEntityId(session.getCounselId()) });

    return createdMessage;
  }

  /**
   * 상담의 마지막 메시지 업데이트
   * @param session 상담 세션
   * @param lastMessage 마지막 메시지
   * @returns 업데이트된 상담 정보
   */
  async updateLastMessage(session: CounselSession, lastMessage: string): Promise<CounselInfo> {
    return this.counselService.saveLastMessage({
      counselId: new UniqueEntityId(session.getCounselId()),
      lastMessage,
    });
  }
}
