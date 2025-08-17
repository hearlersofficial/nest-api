import { Tones, TonesNewProps } from "~counselings/domains/tones/models/tones";

import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class TonesStore {
  abstract create(newProps: TonesNewProps): Promise<Tones>;
  abstract update(tone: Tones): Promise<Tones>;
  abstract updateMany(tones: Tones[]): Promise<Tones[]>;
}
