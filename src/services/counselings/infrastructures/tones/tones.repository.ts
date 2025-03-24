import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { ToneEntity } from "~shared/core/infrastructure/entities/prompts/Tones.entity";
import { Tones } from "~counselings/domains/tones/models/tones";

import { Injectable } from "@nestjs/common";
import { FindManyOptions, FindOneOptions } from "typeorm";

@Injectable()
export abstract class TonesRepository {
  abstract findByToneId(toneId: UniqueEntityId, options?: FindOneOptions<ToneEntity>): Promise<Tones | null>;
  abstract findMany(options?: FindManyOptions<ToneEntity>): Promise<Tones[]>;
  abstract save(tone: Tones): Promise<Tones>;
  abstract save(tones: Tones[]): Promise<Tones[]>;
}
