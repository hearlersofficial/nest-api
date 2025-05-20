import { Result } from "~shared/core/domain/Result";
import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { CreateEpisodeCommand } from "~counselings/domains/episodes/episode.command";
import { EpisodesReader } from "~counselings/domains/episodes/episodes.reader";
import { EpisodesStore } from "~counselings/domains/episodes/episodes.store";
import { EpisodeCutScenes } from "~counselings/domains/episodes/models/episode-cut-scenes";
import { Episodes } from "~counselings/domains/episodes/models/episodes";

import { Injectable } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";

@Injectable()
export class EpisodesService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly episodesReader: EpisodesReader,
    private readonly episodesStore: EpisodesStore,
  ) {}

  async createEpisode(command: CreateEpisodeCommand): Promise<Result<Episodes>> {
    const episode = Episodes.createNew({
      ...command,
      cutScenes: [],
    });

    const cutScenes: EpisodeCutScenes[] = [];

    // 나중에 커맨드 핸들러로 분리하여 구현될 예정
    return Result.ok<Episodes>(null);
  }

  async findEpisodeById(episodeId: UniqueEntityId): Promise<Result<Episodes>> {
    // 에피소드 ID로 조회하는 로직 구현
    return Result.ok<Episodes>(null);
  }

  async findEpisodesByCounselorId(counselorId: UniqueEntityId): Promise<Result<Episodes[]>> {
    // 상담사 ID로 에피소드 목록 조회하는 로직 구현
    return Result.ok<Episodes[]>([]);
  }
}
