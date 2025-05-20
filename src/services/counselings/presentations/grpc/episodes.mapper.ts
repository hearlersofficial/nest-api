import { EpisodeCutScenes } from "~counselings/domains/episodes/models/episode-cut-scenes";
import { Episodes } from "~counselings/domains/episodes/models/episodes";
import {
  Episode,
  EpisodeCutScene,
  EpisodeCutSceneSchema,
  EpisodeSchema,
} from "~proto/com/hearlers/v1/model/counselor_pb";

import { create } from "@bufbuild/protobuf";

export class SchemaEpisodesMapper {
  static toEpisodeProto(episode: Episodes): Episode {
    return create(EpisodeSchema, {
      id: episode.id.getString(),
      counselorId: episode.counselorId.getString(),
      title: episode.title,
      requiredRapportThreshold: episode.requiredRapportThreshold,
      isTemporary: episode.isTemporary,
      cutScenes: episode.cutScenes.map((cutScene) => this.toEpisodeCutSceneProto(cutScene)),
      createdAt: episode.createdAt.toISOString(),
      updatedAt: episode.updatedAt.toISOString(),
      deletedAt: episode.deletedAt ? episode.deletedAt.toISOString() : undefined,
    });
  }

  static toEpisodeCutSceneProto(cutScene: EpisodeCutScenes): EpisodeCutScene {
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
