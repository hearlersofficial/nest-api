import { EpisodeEntity } from "~shared/core/infrastructure/entities/counselors/episode.entity";
import { EpisodeCutSceneEntity } from "~shared/core/infrastructure/entities/counselors/episode-cut-scene.entity";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class EpisodesStore {
  constructor(
    @InjectRepository(EpisodeEntity)
    private readonly episodeRepository: Repository<EpisodeEntity>,
    @InjectRepository(EpisodeCutSceneEntity)
    private readonly episodeCutSceneRepository: Repository<EpisodeCutSceneEntity>,
  ) {}

  // 여기에 저장 관련 메서드 추가 가능
}
