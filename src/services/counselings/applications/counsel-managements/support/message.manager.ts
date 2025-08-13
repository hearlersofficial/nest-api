import { CounselSession } from "~counselings/applications/counsel-managements/models/counsel-session";
import { CounselsService } from "~counselings/domains/counsels/counsels.service";
import { CounselMessageInfo } from "~counselings/domains/counsels/models/counsel-message.info";

import { Injectable } from "@nestjs/common";

/**
 * 메시지 생성/저장을 담당하는 서비스
 * 단일 책임: 상담 메시지의 CRUD 작업만 담당
 */
@Injectable()
export class MessageManager {
  constructor(private readonly counselService: CounselsService) {}

  /**
   * 유저 메시지 생성
   * @param session 상담 세션
   * @param message 유저 메시지
   * @returns 생성된 유저 메시지
   */
  async createUserMessage(session: CounselSession, message: string): Promise<CounselMessageInfo> {
    const { message: createdMessage } = await this.counselService.saveMessage({
      counselId: session.getCounselId(),
      message,
      isUserMessage: true,
    });

    return createdMessage;
  }

  /**
   * 어시스턴트(AI) 메시지 생성
   * @param session 상담 세션
   * @param message AI 메시지
   * @returns 생성된 어시스턴트 메시지
   */
  async createAssistantMessage(session: CounselSession, message: string): Promise<CounselMessageInfo> {
    const { message: createdMessage } = await this.counselService.saveMessage({
      counselId: session.getCounselId(),
      message,
      isUserMessage: false,
    });

    return createdMessage;
  }
}
