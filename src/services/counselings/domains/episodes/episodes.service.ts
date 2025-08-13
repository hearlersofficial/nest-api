import { EpisodesReader } from "~counselings/domains/episodes/episodes.reader";
import { EpisodesStore } from "~counselings/domains/episodes/episodes.store";
import { EpisodeCutScenes, EpisodeCutScenesNewProps } from "~counselings/domains/episodes/models/episode-cut-scenes";
import { Episodes, EpisodesNewProps } from "~counselings/domains/episodes/models/episodes";
import { EpisodesInfo } from "~counselings/domains/episodes/models/episodes.info";
import { Speaker } from "~proto/com/hearlers/v1/model/counselor_pb";

import { HttpStatus, Injectable } from "@nestjs/common";
import { isDefined } from "~common/shared/utils/validate";
import { CounselorId } from "~common/shared-kernel/identifiers/counselor.id";
import { EpisodeId } from "~common/shared-kernel/identifiers/episode.id";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class EpisodesService {
  constructor(
    private readonly episodesReader: EpisodesReader,
    private readonly episodesStore: EpisodesStore,
  ) {}

  @Transactional()
  async create(newProps: EpisodesNewProps): Promise<EpisodesInfo> {
    const episode = await this.episodesStore.create(newProps);
    return EpisodesInfo.fromDomain(episode);
  }

  @Transactional()
  async update(episode: Episodes): Promise<EpisodesInfo> {
    const updatedEpisode = await this.episodesStore.update(episode);
    return EpisodesInfo.fromDomain(updatedEpisode);
  }

  @Transactional()
  async updateMany(episodes: Episodes[]): Promise<EpisodesInfo[]> {
    const updatedEpisodes = await this.episodesStore.updateMany(episodes);
    return EpisodesInfo.fromDomainArray(updatedEpisodes);
  }

  @Transactional()
  async delete(episodeId: EpisodeId): Promise<EpisodesInfo> {
    const episode = await this.episodesReader.getEpisodeById(episodeId, true);
    const result = episode.delete();
    if (result.isFailureResult()) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, result.error);
    }
    const deletedEpisode = await this.episodesStore.update(episode);
    return EpisodesInfo.fromDomain(deletedEpisode);
  }

  async findEpisodesByCounselorId(counselorId: CounselorId, withTemporary: boolean = false): Promise<EpisodesInfo[]> {
    const episodes = await this.episodesReader.findEpisodesByCounselorId(counselorId, withTemporary);
    return EpisodesInfo.fromDomainArray(episodes);
  }

  async findEpisodeById(episodeId: EpisodeId, withTemporary: boolean = false): Promise<EpisodesInfo | null> {
    const episode = await this.episodesReader.findEpisodeById(episodeId, withTemporary);
    return episode ? EpisodesInfo.fromDomain(episode) : null;
  }

  async getEpisodeById(episodeId: EpisodeId, withTemporary: boolean = false): Promise<EpisodesInfo> {
    const episode = await this.episodesReader.getEpisodeById(episodeId, withTemporary);
    return EpisodesInfo.fromDomain(episode);
  }

  @Transactional()
  async updateEpisode(params: {
    episodeId: EpisodeId;
    title?: string;
    requiredRapportThreshold?: number;
    isTemporary?: boolean;
    cutScenes?: {
      id?: string;
      speaker: Speaker;
      content: string;
      orderIndex: number;
      image: string;
    }[];
  }): Promise<EpisodesInfo> {
    const { episodeId, title, requiredRapportThreshold, isTemporary, cutScenes } = params;
    const episode = await this.episodesReader.getEpisodeById(episodeId, true);

    // 에피소드 기본 정보 업데이트
    if (isDefined(title) || isDefined(requiredRapportThreshold) || isDefined(isTemporary)) {
      const updateResult = episode.update({ title, requiredRapportThreshold, isTemporary });
      if (updateResult.isFailureResult()) {
        throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, updateResult.error);
      }

      const validateResult = episode.validateDomain();
      if (validateResult.isFailureResult()) {
        throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, validateResult.error);
      }
    }

    // 컷신 업데이트
    if (cutScenes) {
      const updatedCutScenes = cutScenes.map((cutScene) => {
        if (cutScene.id) {
          const existingCutScene = episode.cutScenes.find((cs) => cs.id.toString() === cutScene.id);
          if (existingCutScene) {
            const updatedCutScene = existingCutScene.update({
              speaker: cutScene.speaker,
              content: cutScene.content,
              orderIndex: cutScene.orderIndex,
              image: cutScene.image,
            });
            if (updatedCutScene.isFailureResult()) {
              throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, updatedCutScene.error);
            }
            return updatedCutScene.value;
          }
        }

        // 새로운 컷신 생성
        const newCutSceneProps: EpisodeCutScenesNewProps = {
          ...cutScene,
          episodeId: episode.id,
        };
        const newCutScene = EpisodeCutScenes.createNew(newCutSceneProps);
        if (newCutScene.isFailureResult()) {
          throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, newCutScene.error);
        }
        return newCutScene.value;
      });

      const updateCutScenesResult = episode.updateCutScenes(updatedCutScenes);
      if (updateCutScenesResult.isFailureResult()) {
        throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, updateCutScenesResult.error);
      }
    }

    const updatedEpisode = await this.episodesStore.update(episode);
    return EpisodesInfo.fromDomain(updatedEpisode);
  }
}
