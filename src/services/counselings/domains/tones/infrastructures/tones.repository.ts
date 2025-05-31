import { Tones } from "~counselings/domains/tones/models/tones";

import { Injectable } from "@nestjs/common";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";
import { ToneEntity } from "~common/system/persistences/entities/counselors/tone.entity";
import { FindManyOptions, FindOneOptions } from "typeorm";

@Injectable()
export abstract class TonesRepository {
  abstract findByToneId(toneId: UniqueEntityId, options?: FindOneOptions<ToneEntity>): Promise<Tones | null>;
  abstract findMany(options?: FindManyOptions<ToneEntity>): Promise<Tones[]>;
  abstract save(tone: Tones): Promise<Tones>;
  abstract save(tones: Tones[]): Promise<Tones[]>;
}
