import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { isDefined } from "~shared/utils/Validate.utils";
import { EpisodesService } from "~counselings/domains/episodes/episodes.service";
import { EpisodeCutScenes, EpisodeCutScenesNewProps } from "~counselings/domains/episodes/models/episode-cut-scenes";
import { Episodes, EpisodesNewProps } from "~counselings/domains/episodes/models/episodes";
import { Speaker } from "~proto/com/hearlers/v1/model/counselor_pb";

import { HttpStatus, Injectable } from "@nestjs/common";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class EpisodesFacade {
  constructor(private readonly episodesService: EpisodesService) {}

  @Transactional()
  async createEpisode(params: {
    counselorId: UniqueEntityId;
    title: string;
    requiredRapportThreshold: number;
    isTemporary: boolean;
    cutScenes: {
      speaker: Speaker;
      content: string;
      orderIndex: number;
      image: string;
    }[];
  }): Promise<Episodes> {
    const { counselorId, title, requiredRapportThreshold, isTemporary, cutScenes } = params;
    const newProps: EpisodesNewProps = {
      counselorId,
      title,
      requiredRapportThreshold,
      isTemporary,
      cutScenes: cutScenes.map((cutScene) => ({
        ...cutScene,
      })),
    };
    return this.episodesService.create(newProps);
  }

  async findEpisodes(params: { counselorId: UniqueEntityId; withTemporary?: boolean }): Promise<Episodes[]> {
    const { counselorId, withTemporary = false } = params;
    return this.episodesService.findEpisodesByCounselorId(counselorId, withTemporary);
  }

  async findEpisodeById(params: { episodeId: UniqueEntityId; withTemporary?: boolean }): Promise<Episodes | null> {
    const { episodeId, withTemporary = false } = params;
    return this.episodesService.findEpisodeById(episodeId, withTemporary);
  }

  @Transactional()
  async updateEpisode(params: {
    episodeId: UniqueEntityId;
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
  }): Promise<Episodes> {
    const { episodeId, title, requiredRapportThreshold, isTemporary, cutScenes } = params;
    const episode = await this.episodesService.getEpisodeById(episodeId, true);

    if (isDefined(title) && isDefined(requiredRapportThreshold) && isDefined(isTemporary)) {
      episode.update({ title, requiredRapportThreshold, isTemporary });
      const validateResult = episode.validateDomain();
      if (validateResult.isFailureResult()) {
        throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, validateResult.error);
      }
    }

    if (cutScenes) {
      const updatedCutScenes = cutScenes.map((cutScene) => {
        if (cutScene.id) {
          const existingCutScene = episode.cutScenes.find((cs) => cs.id.getString() === cutScene.id);
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

      episode.updateCutScenes(updatedCutScenes);
    }
    console.log(episode);

    return this.episodesService.update(episode);
  }
}
