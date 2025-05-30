import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { ProtoRequest } from "~shared/utils/Rpc.utils";
import { EpisodesFacade } from "~counselings/applications/episodes.facade";
import { SchemaEpisodesMapper } from "~counselings/presentations/grpc/episodes.mapper";
import {
  FindEpisodeByIdRequest,
  FindEpisodeByIdRequestSchema,
  FindEpisodeByIdResponse,
  FindEpisodeByIdResponseSchema,
  FindEpisodesRequest,
  FindEpisodesRequestSchema,
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
  @ProtoRequest(FindEpisodesRequestSchema)
  async findEpisodes(request: FindEpisodesRequest): Promise<FindEpisodesResponse> {
    const { counselorId, withTemporary } = request;
    const episodes = await this.episodesFacade.findEpisodes({
      counselorId: new UniqueEntityId(counselorId),
      withTemporary,
    });
    return create(FindEpisodesResponseSchema, {
      episodes: episodes.map((episode) => SchemaEpisodesMapper.toEpisodeProto(episode)),
    });
  }

  @GrpcMethod("CounselorService", "FindEpisodeById")
  @ProtoRequest(FindEpisodeByIdRequestSchema)
  async findEpisodeById(request: FindEpisodeByIdRequest): Promise<FindEpisodeByIdResponse> {
    const { episodeId, withTemporary } = request;
    const episode = await this.episodesFacade.findEpisodeById({
      episodeId: new UniqueEntityId(episodeId),
      withTemporary,
    });
    return create(FindEpisodeByIdResponseSchema, {
      episode: episode ? SchemaEpisodesMapper.toEpisodeProto(episode) : undefined,
    });
  }
}
