import { Tones } from "~counselings/domains/tones/models/tones";

import { Injectable } from "@nestjs/common";
import { ToneId } from "~common/shared-kernel/identifiers/tone.id";
import { ToneEntity } from "~common/system/persistences/entities/counselors/tone.entity";
import { FindManyOptions, FindOneOptions } from "typeorm";

@Injectable()
export abstract class TonesRepository {
  abstract findByToneId(toneId: ToneId, options?: FindOneOptions<ToneEntity>): Promise<Tones | null>;
  abstract findMany(options?: FindManyOptions<ToneEntity>): Promise<Tones[]>;
  abstract save(tone: Tones): Promise<Tones>;
  abstract save(tones: Tones[]): Promise<Tones[]>;
}
