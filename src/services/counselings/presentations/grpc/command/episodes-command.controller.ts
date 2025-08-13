import { CounselorManagementsFacade } from "~counselings/applications/counselor-managements/counselor-managements.facade";
import { SchemaEpisodesMapper } from "~counselings/presentations/grpc/episodes.mapper";
import {
  CreateEpisodeRequest,
  CreateEpisodeRequestSchema,
  CreateEpisodeResponse,
  CreateEpisodeResponseSchema,
  GenerateCutSceneImageUrlRequest,
  GenerateCutSceneImageUrlRequestSchema,
  GenerateCutSceneImageUrlResponse,
  GenerateCutSceneImageUrlResponseSchema,
  UpdateEpisodeRequest,
  UpdateEpisodeRequestSchema,
  UpdateEpisodeResponse,
  UpdateEpisodeResponseSchema,
} from "~proto/com/hearlers/v1/service/counselor_pb";

import { create } from "@bufbuild/protobuf";
import { Controller, Logger } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import { ProtoRequest } from "~common/shared/utils/rpc";
import { CounselorId } from "~common/shared-kernel/identifiers/counselor.id";
import { EpisodeId } from "~common/shared-kernel/identifiers/episode.id";
import { ImageStorageService } from "~common/support/image-storage/image-storage.service";
import { SchemaPresignedUrlMapper } from "~common/support/image-storage/presigned-url.mapper";

@Controller("episode")
export class GrpcEpisodeCommandController {
  private readonly logger = new Logger(GrpcEpisodeCommandController.name);

  constructor(
    private readonly counselorManagementsFacade: CounselorManagementsFacade,
    private readonly imageStorageService: ImageStorageService,
  ) {}

  @GrpcMethod("CounselorService", "CreateEpisode")
  @ProtoRequest(CreateEpisodeRequestSchema)
  async createEpisode(request: CreateEpisodeRequest): Promise<CreateEpisodeResponse> {
    const { counselorId, title, requiredRapportThreshold, isTemporary, cutScenes } = request;

    const episode = await this.counselorManagementsFacade.createEpisode({
      counselorId: new CounselorId(counselorId),
      title,
      requiredRapportThreshold,
      isTemporary: isTemporary ?? false,
      cutScenes:
        cutScenes?.map((cutScene) => ({
          speaker: cutScene.speaker,
          content: cutScene.content,
          orderIndex: cutScene.orderIndex,
          image: cutScene.image,
        })) || [],
    });
    return create(CreateEpisodeResponseSchema, {
      episode: SchemaEpisodesMapper.toEpisodeProto(episode),
    });
  }

  @GrpcMethod("CounselorService", "UpdateEpisode")
  @ProtoRequest(UpdateEpisodeRequestSchema)
  async updateEpisode(request: UpdateEpisodeRequest): Promise<UpdateEpisodeResponse> {
    const { episodeId, title, requiredRapportThreshold, isTemporary, cutScenes } = request;
    const episode = await this.counselorManagementsFacade.updateEpisode({
      episodeId: new EpisodeId(episodeId),
      title,
      requiredRapportThreshold,
      isTemporary,
      cutScenes: cutScenes?.map((cutScene) => ({
        id: cutScene.id,
        speaker: cutScene.speaker,
        content: cutScene.content,
        orderIndex: cutScene.orderIndex,
        image: cutScene.image,
      })),
    });
    return create(UpdateEpisodeResponseSchema, {
      episode: SchemaEpisodesMapper.toEpisodeProto(episode),
    });
  }

  @GrpcMethod("CounselorService", "GenerateCutSceneImageUrl")
  @ProtoRequest(GenerateCutSceneImageUrlRequestSchema)
  async generateCutSceneImageUrl(request: GenerateCutSceneImageUrlRequest): Promise<GenerateCutSceneImageUrlResponse> {
    const { counselorId, extension } = request;
    this.logger.log(`Generating cut scene image URL for episodeId: ${counselorId} with extension: ${extension}`);

    try {
      const presignedUrl = await this.imageStorageService.getSignedUrlForUpload(`${counselorId}`, {
        useCase: "episode-cut-scenes",
        entityId: counselorId,
        generateUniqueFileName: true,
        extension,
      });

      this.logger.log(`Generated upload URL: ${presignedUrl.getUploadUrl().substring(0, 50)}...`);
      this.logger.log(`Image will be stored at: ${presignedUrl.getFilePath()}`);

      return create(GenerateCutSceneImageUrlResponseSchema, {
        presignedUrl: SchemaPresignedUrlMapper.toPresignedUrlProto(presignedUrl),
      });
    } catch (error) {
      this.logger.error(`Error generating cut scene image URL: ${error.message}`, error.stack);
      throw error;
    }
  }
}
