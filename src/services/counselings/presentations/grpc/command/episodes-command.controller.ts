import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { ImageStorageService } from "~shared/core/infrastructure/image-storage";
import { SchemaPresignedUrlMapper } from "~shared/core/presentations/presigned-url.mapper";
import { EpisodesFacade } from "~counselings/applications/episodes.facade";
import { SchemaEpisodesMapper } from "~counselings/presentations/grpc/episodes.mapper";
import {
  CreateEpisodeRequest,
  CreateEpisodeResponse,
  CreateEpisodeResponseSchema,
  GenerateCutSceneImageUrlRequest,
  GenerateCutSceneImageUrlResponse,
  GenerateCutSceneImageUrlResponseSchema,
  UpdateEpisodeRequest,
  UpdateEpisodeResponse,
  UpdateEpisodeResponseSchema,
} from "~proto/com/hearlers/v1/service/counselor_pb";

import { create } from "@bufbuild/protobuf";
import { Controller, Logger } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";

@Controller("episode")
export class GrpcEpisodeCommandController {
  private readonly logger = new Logger(GrpcEpisodeCommandController.name);

  constructor(
    private readonly episodesFacade: EpisodesFacade,
    private readonly imageStorageService: ImageStorageService
  ) {}

  @GrpcMethod("CounselorService", "CreateEpisode")
  async createEpisode(
    request: CreateEpisodeRequest
  ): Promise<CreateEpisodeResponse> {
    const {
      counselorId,
      title,
      requiredRapportThreshold,
      isTemporary,
      cutScenes,
    } = request;
    const episode = await this.episodesFacade.createEpisode({
      counselorId: new UniqueEntityId(counselorId),
      title,
      requiredRapportThreshold,
      isTemporary: isTemporary ?? false,
      cutScenes: cutScenes.map((cutScene) => ({
        speaker: cutScene.speaker,
        content: cutScene.content,
        orderIndex: cutScene.orderIndex,
        image: cutScene.image,
      })),
    });
    return create(CreateEpisodeResponseSchema, {
      episode: SchemaEpisodesMapper.toEpisodeProto(episode),
    });
  }

  @GrpcMethod("CounselorService", "UpdateEpisode")
  async updateEpisode(
    request: UpdateEpisodeRequest
  ): Promise<UpdateEpisodeResponse> {
    const {
      episodeId,
      title,
      requiredRapportThreshold,
      isTemporary,
      cutScenes,
    } = request;
    const episode = await this.episodesFacade.updateEpisode({
      episodeId: new UniqueEntityId(episodeId),
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
  async generateCutSceneImageUrl(
    request: GenerateCutSceneImageUrlRequest
  ): Promise<GenerateCutSceneImageUrlResponse> {
    const { episodeId, extension } = request;
    this.logger.log(
      `Generating cut scene image URL for episodeId: ${episodeId} with extension: ${extension}`
    );

    try {
      const presignedUrl = await this.imageStorageService.getSignedUrlForUpload(
        `${episodeId}`,
        {
          useCase: "episode-cut-scenes",
          entityId: episodeId,
          generateUniqueFileName: true,
          extension,
        }
      );

      this.logger.log(
        `Generated upload URL: ${presignedUrl
          .getUploadUrl()
          .substring(0, 50)}...`
      );
      this.logger.log(`Image will be stored at: ${presignedUrl.getFilePath()}`);

      return create(GenerateCutSceneImageUrlResponseSchema, {
        presignedUrl:
          SchemaPresignedUrlMapper.toPresignedUrlProto(presignedUrl),
      });
    } catch (error) {
      this.logger.error(
        `Error generating cut scene image URL: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }
}
