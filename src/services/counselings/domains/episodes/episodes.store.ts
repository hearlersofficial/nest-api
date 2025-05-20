import { Episodes, EpisodesNewProps } from "~counselings/domains/episodes/models/episodes";

import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class EpisodesStore {
  abstract create(newProps: EpisodesNewProps): Promise<Episodes>;
  abstract update(episode: Episodes): Promise<Episodes>;
  abstract updateMany(episodes: Episodes[]): Promise<Episodes[]>;
}
