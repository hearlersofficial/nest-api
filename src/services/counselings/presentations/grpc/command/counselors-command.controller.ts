import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { ImageStorageService } from "~shared/core/infrastructure/image-storage";
import { SchemaPresignedUrlMapper } from "~shared/core/presentations/presigned-url.mapper";
import { CounselorsFacade } from "~counselings/applications/counselors.facade";
import { TonesFacade } from "~counselings/applications/tones.facade";
import { SchemaCounselorsMapper } from "~counselings/presentations/grpc/counselors.mapper";
import {
  CreateBubbleRequest,
  CreateBubbleResponse,
  CreateBubbleResponseSchema,
  CreateCounselorRequest,
  CreateCounselorResponse,
  CreateCounselorResponseSchema,
  CreateToneRequest,
  CreateToneResponse,
  CreateToneResponseSchema,
  DeleteBubbleRequest,
  DeleteBubbleResponse,
  DeleteBubbleResponseSchema,
  GenerateCounselorImageUrlRequest,
  GenerateCounselorImageUrlResponse,
  GenerateCounselorImageUrlResponseSchema,
  UpdateBubbleRequest,
  UpdateBubbleResponse,
  UpdateBubbleResponseSchema,
  UpdateCounselorRequest,
  UpdateCounselorResponse,
  UpdateCounselorResponseSchema,
  UpdateToneRequest,
  UpdateToneResponse,
  UpdateToneResponseSchema,
} from "~proto/com/hearlers/v1/service/counselor_pb";

import { create } from "@bufbuild/protobuf";
import { Controller, Logger } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";

@Controller("counselor")
export class GrpcCounselorCommandController {
  private readonly logger = new Logger(GrpcCounselorCommandController.name);

  constructor(
    private readonly counselorsFacade: CounselorsFacade,
    private readonly tonesFacade: TonesFacade,
    private readonly imageStorageService: ImageStorageService,
  ) {}

  // Counselor
  @GrpcMethod("CounselorService", "CreateCounselor")
  async createCounselor(request: CreateCounselorRequest): Promise<CreateCounselorResponse> {
    const { toneId, name, description, profileImage, counselorGender } = request;
    const counselor = await this.counselorsFacade.createCounselor({
      toneId: new UniqueEntityId(toneId),
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
  async updateCounselor(request: UpdateCounselorRequest): Promise<UpdateCounselorResponse> {
    const { counselorId, toneId, name, description, profileImage, counselorGender } = request;
    const counselor = await this.counselorsFacade.updateCounselor({
      counselorId: new UniqueEntityId(counselorId),
      toneId: toneId ? new UniqueEntityId(toneId) : undefined,
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
  async createTone(request: CreateToneRequest): Promise<CreateToneResponse> {
    const { name, description } = request;
    const tone = await this.tonesFacade.createTone({
      name,
      description,
    });
    return create(CreateToneResponseSchema, {
      tone: SchemaCounselorsMapper.toToneProto(tone),
    });
  }

  @GrpcMethod("CounselorService", "UpdateTone")
  async updateTone(request: UpdateToneRequest): Promise<UpdateToneResponse> {
    const { toneId, name, description } = request;
    const tone = await this.tonesFacade.updateTone({
      toneId: new UniqueEntityId(toneId),
      name,
      description,
    });
    return create(UpdateToneResponseSchema, {
      tone: SchemaCounselorsMapper.toToneProto(tone),
    });
  }

  @GrpcMethod("CounselorService", "GenerateCounselorImageUrl")
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
  async createBubble(request: CreateBubbleRequest): Promise<CreateBubbleResponse> {
    const { counselorId, question, responseOption1, responseOption2 } = request;
    const bubble = await this.counselorsFacade.createBubble({
      counselorId: new UniqueEntityId(counselorId),
      question,
      responseOption1,
      responseOption2,
    });
    return create(CreateBubbleResponseSchema, {
      bubble: SchemaCounselorsMapper.toBubbleProto(bubble),
    });
  }

  @GrpcMethod("CounselorService", "UpdateBubble")
  async updateBubble(request: UpdateBubbleRequest): Promise<UpdateBubbleResponse> {
    const { bubbleId, counselorId, question, responseOption1, responseOption2 } = request;
    const bubble = await this.counselorsFacade.updateBubble({
      bubbleId: new UniqueEntityId(bubbleId),
      counselorId: new UniqueEntityId(counselorId),
      question,
      responseOption1,
      responseOption2,
    });
    return create(UpdateBubbleResponseSchema, {
      bubble: SchemaCounselorsMapper.toBubbleProto(bubble),
    });
  }

  @GrpcMethod("CounselorService", "DeleteBubble")
  async deleteBubble(request: DeleteBubbleRequest): Promise<DeleteBubbleResponse> {
    const { bubbleId, counselorId } = request;
    await this.counselorsFacade.deleteBubble({
      bubbleId: new UniqueEntityId(bubbleId),
      counselorId: new UniqueEntityId(counselorId),
    });
    return create(DeleteBubbleResponseSchema, {});
  }
}
