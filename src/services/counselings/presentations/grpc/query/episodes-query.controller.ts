import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { EpisodesFacade } from "~counselings/applications/episodes.facade";
import { SchemaEpisodesMapper } from "~counselings/presentations/grpc/episodes.mapper";
import {
  FindEpisodeByIdRequest,
  FindEpisodeByIdResponse,
  FindEpisodeByIdResponseSchema,
  FindEpisodesRequest,
  FindEpisodesResponse,
  FindEpisodesResponseSchema,
} from "~proto/com/hearlers/v1/service/counselor_pb";

import { create } from "@bufbuild/protobuf";
import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";

@Controller("episodes")
export class GrpcEpisodeQueryController {
  constructor(private readonly episodesFacade: EpisodesFacade) {}

  @GrpcMethod("CounselorService", "FindEpisodes")
  async findEpisodes(request: FindEpisodesRequest): Promise<FindEpisodesResponse> {
    const { counselorId } = request;
    const episodes = await this.episodesFacade.findEpisodes({
      counselorId: new UniqueEntityId(counselorId),
    });
    return create(FindEpisodesResponseSchema, {
      episodes: episodes.map((episode) => SchemaEpisodesMapper.toEpisodeProto(episode)),
    });
  }

  @GrpcMethod("CounselorService", "FindEpisodeById")
  async findEpisodeById(request: FindEpisodeByIdRequest): Promise<FindEpisodeByIdResponse> {
    const { episodeId } = request;
    const episode = await this.episodesFacade.findEpisodeById({
      episodeId: new UniqueEntityId(episodeId),
    });
    return create(FindEpisodeByIdResponseSchema, {
      episode: episode ? SchemaEpisodesMapper.toEpisodeProto(episode) : undefined,
    });
  }
}
