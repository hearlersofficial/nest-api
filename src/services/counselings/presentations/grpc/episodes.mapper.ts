import { EpisodeCutScenesInfo, EpisodesInfo } from "~counselings/domains/episodes/models/episodes.info";
import {
  Episode,
  EpisodeCutScene,
  EpisodeCutSceneSchema,
  EpisodeSchema,
} from "~proto/com/hearlers/v1/model/counselor_pb";

import { create } from "@bufbuild/protobuf";

export class SchemaEpisodesMapper {
  static toEpisodeProto(episode: null): null;
  static toEpisodeProto(episode: EpisodesInfo): Episode;
  static toEpisodeProto(episode: EpisodesInfo | null): Episode | null;
  static toEpisodeProto(episode: EpisodesInfo | null): Episode | null {
    if (!episode) {
      return null;
    }
    return create(EpisodeSchema, {
      id: episode.id.getString(),
      counselorId: episode.counselorId.getString(),
      title: episode.title,
      requiredRapportThreshold: episode.requiredRapportThreshold,
      isTemporary: episode.isTemporary,
      cutScenes: (episode.cutScenes ?? []).map((cutScene) => SchemaEpisodesMapper.toEpisodeCutSceneProto(cutScene)),
      createdAt: episode.createdAt.toISOString(),
      updatedAt: episode.updatedAt.toISOString(),
      deletedAt: episode.deletedAt ? episode.deletedAt.toISOString() : undefined,
    });
  }

  static toEpisodeCutSceneProto(cutScene: null): null;
  static toEpisodeCutSceneProto(cutScene: EpisodeCutScenesInfo): EpisodeCutScene;
  static toEpisodeCutSceneProto(cutScene: EpisodeCutScenesInfo | null): EpisodeCutScene | null;
  static toEpisodeCutSceneProto(cutScene: EpisodeCutScenesInfo | null): EpisodeCutScene | null {
    if (!cutScene) {
      return null;
    }
    return create(EpisodeCutSceneSchema, {
      id: cutScene.id.getString(),
      episodeId: cutScene.episodeId.getString(),
      speaker: cutScene.speaker,
      content: cutScene.content,
      orderIndex: cutScene.orderIndex,
      image: cutScene.image,
      createdAt: cutScene.createdAt.toISOString(),
      updatedAt: cutScene.updatedAt.toISOString(),
      deletedAt: cutScene.deletedAt ? cutScene.deletedAt.toISOString() : undefined,
    });
  }
}
