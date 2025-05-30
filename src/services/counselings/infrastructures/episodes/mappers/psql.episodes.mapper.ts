import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { EpisodeEntity } from "~shared/core/infrastructure/entities/counselors/episode.entity";
import { EpisodeCutSceneEntity } from "~shared/core/infrastructure/entities/counselors/episode-cut-scene.entity";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { EpisodeCutScenes, EpisodeCutScenesProps } from "~counselings/domains/episodes/models/episode-cut-scenes";
import { Episodes, EpisodesProps } from "~counselings/domains/episodes/models/episodes";

import { HttpStatus } from "@nestjs/common";
import dayjs from "dayjs";

export class PsqlEpisodesMapper {
  static toDomain(entity: null): null;
  static toDomain(entity: EpisodeEntity): Episodes;
  static toDomain(entity: EpisodeEntity | null): Episodes | null;
  static toDomain(entity: EpisodeEntity | null): Episodes | null {
    if (!entity) {
      return null;
    }

    const episodeProps: EpisodesProps = {
      counselorId: new UniqueEntityId(entity.counselorId),
      title: entity.title,
      requiredRapportThreshold: entity.requiredRapportThreshold,
      isTemporary: entity.isTemporary,
      cutScenes: (entity.cutScenes ?? []).map((cutScene) => this.toCutSceneDomain(cutScene)),
      createdAt: dayjs(entity.createdAt),
      updatedAt: dayjs(entity.updatedAt),
      deletedAt: entity.deletedAt ? dayjs(entity.deletedAt) : null,
    };
    const episodesOrError = Episodes.create(episodeProps, new UniqueEntityId(entity.id));

    if (episodesOrError.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, episodesOrError.errorValue);
    }

    return episodesOrError.value;
  }

  static toDomains(entities: EpisodeEntity[]): Episodes[] {
    if (entities.length === 0) {
      return [];
    }
    return entities.map((entity) => this.toDomain(entity)).filter((episode) => episode !== null);
  }

  static toEntity(episode: Episodes): EpisodeEntity {
    const entity = new EpisodeEntity();

    entity.id = episode.id.getString();
    entity.counselorId = episode.counselorId.getString();
    entity.title = episode.title;
    entity.requiredRapportThreshold = episode.requiredRapportThreshold;
    entity.isTemporary = episode.isTemporary;
    entity.cutScenes = (episode.cutScenes ?? []).map((cutScene) => this.toCutSceneEntity(episode, cutScene));
    entity.createdAt = episode.createdAt.toISOString();
    entity.updatedAt = episode.updatedAt.toISOString();
    entity.deletedAt = episode.deletedAt ? episode.deletedAt.toISOString() : null;

    return entity;
  }

  static toEntities(episodes: Episodes[]): EpisodeEntity[] {
    return (episodes ?? []).map((episode) => this.toEntity(episode));
  }

  static toCutSceneDomain(entity: null): null;
  static toCutSceneDomain(entity: EpisodeCutSceneEntity): EpisodeCutScenes;
  static toCutSceneDomain(entity: EpisodeCutSceneEntity | null): EpisodeCutScenes | null;
  static toCutSceneDomain(entity: EpisodeCutSceneEntity | null): EpisodeCutScenes | null {
    if (!entity) {
      return null;
    }

    const cutSceneProps: EpisodeCutScenesProps = {
      episodeId: new UniqueEntityId(entity.episodeId),
      speaker: entity.speaker,
      content: entity.content,
      orderIndex: entity.orderIndex,
      image: entity.image,
      createdAt: dayjs(entity.createdAt),
      updatedAt: dayjs(entity.updatedAt),
      deletedAt: entity.deletedAt ? dayjs(entity.deletedAt) : null,
    };
    const cutScenesOrError = EpisodeCutScenes.create(cutSceneProps, new UniqueEntityId(entity.id));

    if (cutScenesOrError.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, cutScenesOrError.errorValue);
    }

    return cutScenesOrError.value;
  }

  static toCutSceneDomains(entities: EpisodeCutSceneEntity[]): EpisodeCutScenes[] {
    return (entities ?? []).map((entity) => this.toCutSceneDomain(entity));
  }

  static toCutSceneEntity(episode: Episodes, cutScene: EpisodeCutScenes): EpisodeCutSceneEntity {
    const entity = new EpisodeCutSceneEntity();

    entity.id = cutScene.id.getString();
    entity.episodeId = episode.id.getString();
    entity.speaker = cutScene.speaker;
    entity.content = cutScene.content;
    entity.orderIndex = cutScene.orderIndex;
    entity.image = cutScene.image;
    entity.createdAt = cutScene.createdAt.toISOString();
    entity.updatedAt = cutScene.updatedAt.toISOString();
    entity.deletedAt = cutScene.deletedAt ? cutScene.deletedAt.toISOString() : null;

    return entity;
  }
}
