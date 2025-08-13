import { CounselorManagementsFacade } from "~counselings/applications/counselor-managements/counselor-managements.facade";
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
import { ProtoRequest } from "~common/shared/utils/rpc";
import { CounselorId } from "~common/shared-kernel/identifiers/counselor.id";
import { EpisodeId } from "~common/shared-kernel/identifiers/episode.id";
@Controller("episodes")
export class GrpcEpisodeQueryController {
  constructor(private readonly counselorManagementsFacade: CounselorManagementsFacade) {}

  @GrpcMethod("CounselorService", "FindEpisodes")
  @ProtoRequest(FindEpisodesRequestSchema)
  async findEpisodes(request: FindEpisodesRequest): Promise<FindEpisodesResponse> {
    const { counselorId, withTemporary } = request;
    const episodes = await this.counselorManagementsFacade.findEpisodes({
      counselorId: new CounselorId(counselorId),
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
    const episode = await this.counselorManagementsFacade.findEpisodeById({
      episodeId: new EpisodeId(episodeId),
      withTemporary,
    });
    return create(FindEpisodeByIdResponseSchema, {
      episode: episode ? SchemaEpisodesMapper.toEpisodeProto(episode) : undefined,
    });
  }
}
