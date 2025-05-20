import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { Episodes } from "~counselings/domains/episodes/models/episodes";

export abstract class EpisodesRepository {
  abstract findOne(where: {
    episodeId?: UniqueEntityId;
    counselorId?: UniqueEntityId;
    isTemporary?: boolean;
  }): Promise<Episodes | null>;
  abstract findMany(where: { counselorId?: UniqueEntityId; isTemporary?: boolean }): Promise<Episodes[]>;
  abstract save(episode: Episodes): Promise<Episodes>;
  abstract save(episode: Episodes[]): Promise<Episodes[]>;
}
