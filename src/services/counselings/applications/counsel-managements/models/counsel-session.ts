import { CounselTechniqueInfo } from "~counselings/domains/counsel-techniques/models/counsel-technique.info";
import { CounselorsInfo } from "~counselings/domains/counselors/models/counselors.info";
import { CompressedMessagesInfo } from "~counselings/domains/counsels/models/compressed-messages.info";
import { CounselMessagesInfo } from "~counselings/domains/counsels/models/counsel-message.info";
import { CounselsInfo } from "~counselings/domains/counsels/models/counsels.info";
import { PersonaPromptInfo } from "~counselings/domains/persona-prompts/models/persona-prompt.info";
import { PromptVersionInfo } from "~counselings/domains/prompt-versions/models/prompt-version.info";
import { TonePromptInfo } from "~counselings/domains/tone-prompts/models/tone-prompt.info";

import { CounselId } from "~common/shared-kernel/identifiers/counsel.id";
import { CounselTechniqueId } from "~common/shared-kernel/identifiers/counsel-techinque.id";
import { UserId } from "~common/shared-kernel/identifiers/user.id";

export type CounselSessionData = {
  counsel: CounselsInfo;
  counselor: CounselorsInfo;
  messages: CounselMessagesInfo[];
  compressedMessages: CompressedMessagesInfo[];
  promptVersion: PromptVersionInfo;
  currentTechnique: CounselTechniqueInfo;
  personaPrompt: PersonaPromptInfo;
  tonePrompt: TonePromptInfo;
};

/**
 * 상담 세션의 컨텍스트 정보를 응집하는 모델 클래스
 * 단일 책임: 상담 세션 관련 정보들을 한 곳에 모으고 편리한 접근 메서드 제공
 */
export class CounselSession {
  private readonly data: CounselSessionData;

  constructor(data: CounselSessionData) {
    this.data = data;
  }

  /**
   * 기본 정보 Getter들
   */
  get counsel(): CounselsInfo {
    return this.data.counsel;
  }

  get counselor(): CounselorsInfo {
    return this.data.counselor;
  }

  get messages(): CounselMessagesInfo[] {
    return this.data.messages;
  }

  get compressedMessages(): CompressedMessagesInfo[] {
    return this.data.compressedMessages;
  }

  get promptVersion(): PromptVersionInfo {
    return this.data.promptVersion;
  }

  get currentTechnique(): CounselTechniqueInfo {
    return this.data.currentTechnique;
  }

  /**
   * 상담 ID 반환
   * @returns 상담 ID
   */
  get counselId(): CounselId {
    return this.data.counsel.id;
  }

  /**
   * 유저 ID 반환
   * @returns 유저 ID
   */
  get userId(): UserId {
    return this.data.counsel.userId;
  }

  get personaPrompt(): PersonaPromptInfo {
    return this.data.personaPrompt;
  }

  get tonePrompt(): TonePromptInfo {
    return this.data.tonePrompt;
  }
  /**
   * 현재 상담기법 ID 반환
   * @returns 상담기법 ID
   */
  get currentTechniqueId(): CounselTechniqueId {
    return this.data.counsel.counselTechniqueId;
  }

  withNewMessage(message: CounselMessagesInfo): CounselSession {
    return new CounselSession({
      counsel: this.data.counsel,
      counselor: this.data.counselor,
      messages: [...this.data.messages, message],
      compressedMessages: this.data.compressedMessages,
      promptVersion: this.data.promptVersion,
      currentTechnique: this.data.currentTechnique,
      personaPrompt: this.data.personaPrompt,
      tonePrompt: this.data.tonePrompt,
    });
  }
}
