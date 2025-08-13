import { CounselorManagementsFacade } from "~counselings/applications/counselor-managements/counselor-managements.facade";
import { SchemaCounselorsMapper } from "~counselings/presentations/grpc/counselors.mapper";
import {
  CreateBubbleRequest,
  CreateBubbleRequestSchema,
  CreateBubbleResponse,
  CreateBubbleResponseSchema,
  CreateCounselorRequest,
  CreateCounselorRequestSchema,
  CreateCounselorResponse,
  CreateCounselorResponseSchema,
  CreateToneRequest,
  CreateToneRequestSchema,
  CreateToneResponse,
  CreateToneResponseSchema,
  DeleteBubbleRequest,
  DeleteBubbleRequestSchema,
  DeleteBubbleResponse,
  DeleteBubbleResponseSchema,
  GenerateCounselorImageUrlRequest,
  GenerateCounselorImageUrlRequestSchema,
  GenerateCounselorImageUrlResponse,
  GenerateCounselorImageUrlResponseSchema,
  UpdateBubbleRequest,
  UpdateBubbleRequestSchema,
  UpdateBubbleResponse,
  UpdateBubbleResponseSchema,
  UpdateCounselorRequest,
  UpdateCounselorRequestSchema,
  UpdateCounselorResponse,
  UpdateCounselorResponseSchema,
  UpdateToneRequest,
  UpdateToneRequestSchema,
  UpdateToneResponse,
  UpdateToneResponseSchema,
} from "~proto/com/hearlers/v1/service/counselor_pb";

import { create } from "@bufbuild/protobuf";
import { Controller, Logger } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import { ProtoRequest } from "~common/shared/utils/rpc";
import { BubbleId } from "~common/shared-kernel/identifiers/bubble.id";
import { CounselorId } from "~common/shared-kernel/identifiers/counselor.id";
import { ToneId } from "~common/shared-kernel/identifiers/tone.id";
import { ImageStorageService } from "~common/support/image-storage/image-storage.service";
import { SchemaPresignedUrlMapper } from "~common/support/image-storage/presigned-url.mapper";

@Controller("counselor")
export class GrpcCounselorCommandController {
  private readonly logger = new Logger(GrpcCounselorCommandController.name);

  constructor(
    private readonly counselorsFacade: CounselorManagementsFacade,
    private readonly imageStorageService: ImageStorageService,
  ) {}

  // Counselor
  @GrpcMethod("CounselorService", "CreateCounselor")
  @ProtoRequest(CreateCounselorRequestSchema)
  async createCounselor(request: CreateCounselorRequest): Promise<CreateCounselorResponse> {
    const { toneId, name, description, profileImage, counselorGender } = request;
    const counselor = await this.counselorsFacade.createCounselor({
      toneId: new ToneId(toneId),
      profileImage,
      name,
      description,
      counselorGender,
    });
    return create(CreateCounselorResponseSchema, {
      counselor: SchemaCounselorsMapper.toCounselorProto(counselor),
    });
  }

  @GrpcMethod("CounselorService", "UpdateCounselor")
  @ProtoRequest(UpdateCounselorRequestSchema)
  async updateCounselor(request: UpdateCounselorRequest): Promise<UpdateCounselorResponse> {
    const { counselorId, toneId, name, description, profileImage, counselorGender } = request;
    const counselor = await this.counselorsFacade.updateCounselor({
      counselorId: new CounselorId(counselorId),
      toneId: toneId ? new ToneId(toneId) : undefined,
      name,
      description,
      profileImage,
      counselorGender,
    });
    return create(UpdateCounselorResponseSchema, {
      counselor: SchemaCounselorsMapper.toCounselorProto(counselor),
    });
  }

  // Tone
  @GrpcMethod("CounselorService", "CreateTone")
  @ProtoRequest(CreateToneRequestSchema)
  async createTone(request: CreateToneRequest): Promise<CreateToneResponse> {
    const { name, description } = request;
    const tone = await this.counselorsFacade.createTone({
      name,
      description,
    });
    return create(CreateToneResponseSchema, {
      tone: SchemaCounselorsMapper.toToneProto(tone),
    });
  }

  @GrpcMethod("CounselorService", "UpdateTone")
  @ProtoRequest(UpdateToneRequestSchema)
  async updateTone(request: UpdateToneRequest): Promise<UpdateToneResponse> {
    const { toneId, name, description } = request;
    const tone = await this.counselorsFacade.updateTone({
      toneId: new ToneId(toneId),
      name,
      description,
    });
    return create(UpdateToneResponseSchema, {
      tone: SchemaCounselorsMapper.toToneProto(tone),
    });
  }

  @GrpcMethod("CounselorService", "GenerateCounselorImageUrl")
  @ProtoRequest(GenerateCounselorImageUrlRequestSchema)
  async generateCounselorImageUrl(
    request: GenerateCounselorImageUrlRequest,
  ): Promise<GenerateCounselorImageUrlResponse> {
    const { counselorId, extension } = request;
    this.logger.log(`Generating counselor image URL for counselorId: ${counselorId} with extension: ${extension}`);

    try {
      // 상담사 이미지를 위한 프리사인드 URL 생성 (이제 extension 사용)
      const presignedUrl = await this.imageStorageService.getSignedUrlForUpload(
        `${counselorId}`, // 기본 파일명 (확장자는 extension으로 지정)
        {
          useCase: "counselor-profiles", // 유스케이스 디렉토리
          entityId: counselorId, // 상담사 ID
          generateUniqueFileName: true, // 고유 파일명 생성
          extension, // proto에서 온 extension 열거형 사용
        },
      );

      this.logger.log(`Generated upload URL: ${presignedUrl.getUploadUrl().substring(0, 50)}...`);
      this.logger.log(`Image will be stored at: ${presignedUrl.getFilePath()}`);

      // PresignedUrl을 Proto 객체로 변환하여 반환
      return create(GenerateCounselorImageUrlResponseSchema, {
        presignedUrl: SchemaPresignedUrlMapper.toPresignedUrlProto(presignedUrl),
      });
    } catch (error) {
      this.logger.error(`Error generating counselor image URL: ${error.message}`, error.stack);
      throw error;
    }
  }

  @GrpcMethod("CounselorService", "CreateBubble")
  @ProtoRequest(CreateBubbleRequestSchema)
  async createBubble(request: CreateBubbleRequest): Promise<CreateBubbleResponse> {
    const { counselorId, question, responseOption1, responseOption2 } = request;
    const bubble = await this.counselorsFacade.createBubble({
      counselorId: new CounselorId(counselorId),
      question,
      responseOption1,
      responseOption2,
    });
    return create(CreateBubbleResponseSchema, {
      bubble: SchemaCounselorsMapper.toBubbleProto(bubble),
    });
  }

  @GrpcMethod("CounselorService", "UpdateBubble")
  @ProtoRequest(UpdateBubbleRequestSchema)
  async updateBubble(request: UpdateBubbleRequest): Promise<UpdateBubbleResponse> {
    const { bubbleId, counselorId, question, responseOption1, responseOption2 } = request;
    const bubble = await this.counselorsFacade.updateBubble({
      bubbleId: new BubbleId(bubbleId),
      counselorId: new CounselorId(counselorId),
      question,
      responseOption1,
      responseOption2,
    });
    return create(UpdateBubbleResponseSchema, {
      bubble: SchemaCounselorsMapper.toBubbleProto(bubble),
    });
  }

  @GrpcMethod("CounselorService", "DeleteBubble")
  @ProtoRequest(DeleteBubbleRequestSchema)
  async deleteBubble(request: DeleteBubbleRequest): Promise<DeleteBubbleResponse> {
    const { bubbleId, counselorId } = request;
    await this.counselorsFacade.deleteBubble({
      bubbleId: new BubbleId(bubbleId),
      counselorId: new CounselorId(counselorId),
    });
    return create(DeleteBubbleResponseSchema, {});
  }
}
