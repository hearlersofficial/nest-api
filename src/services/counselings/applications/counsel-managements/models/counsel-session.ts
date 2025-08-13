import { CounselorsInfo } from "~counselings/domains/counselors/models/counselors.info";
import { CompressedContextInfo } from "~counselings/domains/counsels/models/compressed-context.info";
import { CounselInfo } from "~counselings/domains/counsels/models/counsel.info";
import { CounselMessageInfo } from "~counselings/domains/counsels/models/counsel-message.info";
import { CounselTechniqueInfo } from "~counselings/domains/counselTechniques/models/counselTechnique.info";
import { PromptVersionInfo } from "~counselings/domains/promptVersions/models/promptVersion.info";

import { HttpStatus } from "@nestjs/common";
import { CounselId } from "~common/shared-kernel/identifiers/counsel.id";
import { CounselTechniqueId } from "~common/shared-kernel/identifiers/counsel-techinque.id";
import { CounselorId } from "~common/shared-kernel/identifiers/counselor.id";
import { PersonaPromptId } from "~common/shared-kernel/identifiers/persona-prompt.id";
import { PromptVersionId } from "~common/shared-kernel/identifiers/prompt-version.id";
import { ToneId } from "~common/shared-kernel/identifiers/tone.id";
import { TonePromptId } from "~common/shared-kernel/identifiers/tone-prompt.id";
import { UserId } from "~common/shared-kernel/identifiers/user.id";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";

export type CounselSessionData = {
  counsel: CounselInfo;
  counselor: CounselorsInfo;
  messages: CounselMessageInfo[];
  promptVersion: PromptVersionInfo;
  currentTechnique: CounselTechniqueInfo;
  compressedContexts: CompressedContextInfo[];
};

export type CounselorScopedPromptData = {
  counselorId: CounselorId;
  personaPromptId: PersonaPromptId;
};

export type ToneScopedPromptData = {
  toneId: ToneId;
  tonePromptId: TonePromptId;
  firstCounselTechniqueId: CounselTechniqueId;
};

export type SessionContext = {
  counselId: CounselId;
  userId: UserId;
  counselorId: CounselorId;
  promptVersionId: PromptVersionId;
  currentTechniqueId: CounselTechniqueId;
};

/**
 * 상담 세션의 컨텍스트 정보를 응집하는 모델 클래스
 * 단일 책임: 상담 세션 관련 정보들을 한 곳에 모으고 편리한 접근 메서드 제공
 */
export class CounselSession {
  private readonly counsel: CounselInfo;
  private readonly counselor: CounselorsInfo;
  private readonly messages: CounselMessageInfo[];
  private readonly promptVersion: PromptVersionInfo;
  private readonly currentTechnique: CounselTechniqueInfo;
  private readonly compressedContexts: CompressedContextInfo[];

  constructor(data: CounselSessionData) {
    this.counsel = data.counsel;
    this.counselor = data.counselor;
    this.messages = data.messages;
    this.promptVersion = data.promptVersion;
    this.currentTechnique = data.currentTechnique;
    this.compressedContexts = data.compressedContexts || [];
  }

  /**
   * 세션 컨텍스트 정보 반환
   * @returns 세션 컨텍스트
   */
  getSessionContext(): SessionContext {
    return {
      counselId: this.counsel.id,
      userId: this.counsel.userId,
      counselorId: this.counsel.counselorId,
      promptVersionId: this.counsel.promptVersionId,
      currentTechniqueId: this.counsel.counselTechniqueId,
    };
  }

  /**
   * 상담사 스코프 프롬프트 정보 반환
   * @returns 상담사 스코프 프롬프트 데이터
   */
  getCounselorScopedPrompt(): CounselorScopedPromptData {
    const counselorScopedPrompt = this.promptVersion.counselorScopedPrompts.find(
      (prompt) => prompt.counselorId === this.counselor.id,
    );

    if (!counselorScopedPrompt) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, "Counselor scoped prompt not found");
    }

    return {
      counselorId: counselorScopedPrompt.counselorId,
      personaPromptId: counselorScopedPrompt.personaPromptId,
    };
  }

  /**
   * 톤 스코프 프롬프트 정보 반환
   * @returns 톤 스코프 프롬프트 데이터
   */
  getToneScopedPrompt(): ToneScopedPromptData {
    const toneScopedPrompt = this.promptVersion.toneScopedPrompts.find(
      (prompt) => prompt.toneId === this.counselor.toneId,
    );

    if (!toneScopedPrompt) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, "Tone scoped prompt not found");
    }

    if (!toneScopedPrompt.tonePromptId) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, "Tone prompt ID not found");
    }

    if (!toneScopedPrompt.firstCounselTechniqueId) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, "First counsel technique not found");
    }

    return {
      toneId: toneScopedPrompt.toneId,
      tonePromptId: toneScopedPrompt.tonePromptId,
      firstCounselTechniqueId: toneScopedPrompt.firstCounselTechniqueId,
    };
  }

  /**
   * 기본 정보 Getter들
   */
  getCounsel(): CounselInfo {
    return this.counsel;
  }

  getCounselor(): CounselorsInfo {
    return this.counselor;
  }

  getMessages(): CounselMessageInfo[] {
    return this.messages;
  }

  getPromptVersion(): PromptVersionInfo {
    return this.promptVersion;
  }

  getCurrentTechnique(): CounselTechniqueInfo {
    return this.currentTechnique;
  }

  getCompressedContexts(): CompressedContextInfo[] {
    return this.compressedContexts;
  }

  /**
   * 상담 ID 반환
   * @returns 상담 ID
   */
  getCounselId(): CounselId {
    return this.counsel.id;
  }

  /**
   * 유저 ID 반환
   * @returns 유저 ID
   */
  getUserId(): UserId {
    return this.counsel.userId;
  }

  /**
   * 현재 상담기법 ID 반환
   * @returns 상담기법 ID
   */
  getCurrentTechniqueId(): CounselTechniqueId {
    return this.counsel.counselTechniqueId;
  }

  /**
   * 메시지에 새로운 메시지 추가 (불변성 유지를 위한 새 인스턴스 반환)
   * @param newMessage 새로운 메시지
   * @returns 새로운 CounselSession 인스턴스
   */
  withNewMessage(newMessage: CounselMessageInfo): CounselSession {
    return new CounselSession({
      counsel: this.counsel,
      counselor: this.counselor,
      messages: [...this.messages, newMessage],
      promptVersion: this.promptVersion,
      currentTechnique: this.currentTechnique,
      compressedContexts: this.compressedContexts,
    });
  }

  /**
   * 업데이트된 상담 정보로 새 인스턴스 생성
   * @param updatedCounsel 업데이트된 상담 정보
   * @returns 새로운 CounselSession 인스턴스
   */
  withUpdatedCounsel(updatedCounsel: CounselInfo): CounselSession {
    return new CounselSession({
      counsel: updatedCounsel,
      counselor: this.counselor,
      messages: this.messages,
      promptVersion: this.promptVersion,
      currentTechnique: this.currentTechnique,
      compressedContexts: this.compressedContexts,
    });
  }

  /**
   * 업데이트된 상담기법으로 새 인스턴스 생성
   * @param updatedTechnique 업데이트된 상담기법
   * @returns 새로운 CounselSession 인스턴스
   */
  withUpdatedTechnique(updatedTechnique: CounselTechniqueInfo): CounselSession {
    return new CounselSession({
      counsel: this.counsel,
      counselor: this.counselor,
      messages: this.messages,
      promptVersion: this.promptVersion,
      currentTechnique: updatedTechnique,
      compressedContexts: this.compressedContexts,
    });
  }

  /**
   * 압축된 컨텍스트 추가
   * @param compressedContext 추가할 압축된 컨텍스트
   * @returns 새로운 CounselSession 인스턴스
   */
  withNewCompressedContext(compressedContext: CompressedContextInfo): CounselSession {
    return new CounselSession({
      counsel: this.counsel,
      counselor: this.counselor,
      messages: this.messages,
      promptVersion: this.promptVersion,
      currentTechnique: this.currentTechnique,
      compressedContexts: [...this.compressedContexts, compressedContext],
    });
  }
}
