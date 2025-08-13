import { EpisodeCutScenes } from "~counselings/domains/episodes/models/episode-cut-scenes";
import { Episodes } from "~counselings/domains/episodes/models/episodes";
import { Speaker } from "~proto/com/hearlers/v1/model/counselor_pb";

import { CounselorId } from "~common/shared-kernel/identifiers/counselor.id";
import { EpisodeId } from "~common/shared-kernel/identifiers/episode.id";
import { EpisodeCutSceneId } from "~common/shared-kernel/identifiers/episode-cut-scene.id";
import { Dayjs } from "dayjs";

/**
 * 외부 노출용 에피소드 컷신 정보 클래스
 */
export class EpisodeCutScenesInfo {
  constructor(
    public readonly id: EpisodeCutSceneId,
    public readonly episodeId: EpisodeId,
    public readonly speaker: Speaker,
    public readonly content: string,
    public readonly orderIndex: number,
    public readonly image: string,
    public readonly createdAt: Dayjs,
    public readonly updatedAt: Dayjs,
    public readonly deletedAt: Dayjs | null,
  ) {}

  /**
   * 도메인 모델에서 Info 객체로 변환
   */
  static fromDomain(cutScene: EpisodeCutScenes): EpisodeCutScenesInfo {
    return new EpisodeCutScenesInfo(
      cutScene.id,
      cutScene.episodeId,
      cutScene.speaker,
      cutScene.content,
      cutScene.orderIndex,
      cutScene.image,
      cutScene.createdAt,
      cutScene.updatedAt,
      cutScene.deletedAt,
    );
  }

  /**
   * 도메인 모델 배열에서 Info 배열로 변환
   */
  static fromDomainArray(cutScenes: EpisodeCutScenes[]): EpisodeCutScenesInfo[] {
    return cutScenes.map((cutScene) => EpisodeCutScenesInfo.fromDomain(cutScene));
  }
}

/**
 * 외부 노출용 에피소드 정보 클래스
 */
export class EpisodesInfo {
  constructor(
    public readonly id: EpisodeId,
    public readonly counselorId: CounselorId,
    public readonly title: string,
    public readonly requiredRapportThreshold: number,
    public readonly isTemporary: boolean,
    public readonly cutScenes: EpisodeCutScenesInfo[],
    public readonly createdAt: Dayjs,
    public readonly updatedAt: Dayjs,
    public readonly deletedAt: Dayjs | null,
  ) {}

  /**
   * 도메인 모델에서 Info 객체로 변환
   */
  static fromDomain(episode: Episodes): EpisodesInfo {
    return new EpisodesInfo(
      episode.id,
      episode.counselorId,
      episode.title,
      episode.requiredRapportThreshold,
      episode.isTemporary,
      EpisodeCutScenesInfo.fromDomainArray(episode.cutScenes),
      episode.createdAt,
      episode.updatedAt,
      episode.deletedAt,
    );
  }

  /**
   * 도메인 모델 배열에서 Info 배열로 변환
   */
  static fromDomainArray(episodes: Episodes[]): EpisodesInfo[] {
    return episodes.map((episode) => EpisodesInfo.fromDomain(episode));
  }
}
