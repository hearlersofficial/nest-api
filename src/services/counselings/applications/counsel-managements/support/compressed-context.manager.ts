import { CompressedContextService } from "~counselings/domains/compressedContext/compressedContext.service";
import { CompressedContextInfo } from "~counselings/domains/compressedContext/models/compressedContext.info";
import { CounselMessagesService } from "~counselings/domains/counselMessages/counselMessages.service";
import { CounselMessageInfo } from "~counselings/domains/counselMessages/models/counselMessage.info";
import { CounselsService } from "~counselings/domains/counsels/counsels.service";
import { CounselInfo } from "~counselings/domains/counsels/models/counsel.info";

import { Injectable } from "@nestjs/common";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";

export interface CompressedContextManagementParams {
  counsel: CounselInfo;
}

export interface CompressedContextManagementResult {
  counsel: CounselInfo;
  compressedContexts: CompressedContextInfo[];
}

export interface ContextCompressRequest {
  counsel: CounselInfo;
  existingCompressedContexts: CompressedContextInfo[];
  messagesToCompress: CounselMessageInfo[];
}

export interface ContextCompressResult {
  compressedContext: string;
  messageCountAtCompression: number;
}

export interface BackgroundCompressionResult {
  compressionPerformed: boolean;
  compressedContext?: CompressedContextInfo;
  error?: string;
}

@Injectable()
export class CompressedContextManager {
  constructor(
    private readonly counselService: CounselsService,
    private readonly counselMessageService: CounselMessagesService,
    private readonly compressedcontextService: CompressedContextService,
  ) {}

  /**
   * 압축된 컨텍스트 조회
   * @param params - 상담 정보
   * @returns - 압축된 컨텍스트 정보
   */
  async getCompressedContexts(params: CompressedContextManagementParams): Promise<CompressedContextManagementResult> {
    const { counsel } = params;

    const compressedContexts = await this.compressedcontextService.getMany({
      counselId: new UniqueEntityId(counsel.id),
    });

    return {
      counsel,
      compressedContexts,
    };
  }

  /**
   * 맥락 압축 필요여부 확인 및 요청 정보 생성
   * @param params - 상담 정보
   * @returns - 압축 요청 정보
   *
   * @todo - 압축에 대한 트리거 고민
   */
  async prepareBackgroundCompression(
    params: CompressedContextManagementParams,
  ): Promise<{ shouldCompress: false; reason: string } | { shouldCompress: true; request: ContextCompressRequest }> {
    const { counsel } = params;
    if (!counsel.shouldCompressContext) {
      return {
        shouldCompress: false,
        reason: "Context compression is not required.",
      };
    }

    try {
      const messages = await this.counselMessageService.getMany({
        counselId: new UniqueEntityId(counsel.id),
      });
      // 압축되지 않은 메시지만 선택
      const messagesToCompress = counsel.compressedContextExists
        ? messages.slice(counsel.notCompressedMessageCount)
        : messages;

      // 기존에 존재하는 압축된 컨텍스트 조회 (최대 10개)
      const existingCompressedContexts = counsel.compressedContextExists
        ? (
            await this.compressedcontextService.getMany({
              counselId: new UniqueEntityId(counsel.id),
            })
          ).slice(-10)
        : [];

      return {
        shouldCompress: true,
        request: {
          counsel,
          existingCompressedContexts,
          messagesToCompress,
        },
      };
    } catch (error) {
      return {
        shouldCompress: false,
        reason: "Failed to retrieve messages.",
      };
    }
  }

  /**
   * AI로 압축된 상담 맥락을 저장하는 로직
   * @param request - 압축 요청 정보
   * @param result - 압축 결과 정보
   * @returns - 압축된 컨텍스트 정보
   */
  async processContextCompression(
    request: ContextCompressRequest,
    result: ContextCompressResult,
  ): Promise<BackgroundCompressionResult> {
    try {
      const { counsel } = request;
      const { compressedContext, messageCountAtCompression } = result;

      const compressedContextInfo = await this.compressedcontextService.create({
        counselId: new UniqueEntityId(counsel.id),
        content: compressedContext,
        messageCountAtCompression,
      });
      await this.counselService.markContextCompressed({
        counselId: new UniqueEntityId(counsel.id),
      });

      return {
        compressionPerformed: true,
        compressedContext: compressedContextInfo,
      };
    } catch (error) {
      return {
        compressionPerformed: false,
        error: error.message,
      };
    }
  }
}
