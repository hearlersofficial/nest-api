import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { Tones } from "~counselings/aggregates/tones/domain/tones";
import {
  TONE_REPOSITORY,
  ToneRepositoryPort,
} from "~counselings/aggregates/tones/infrastructures/tones.repository.port";

import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class ToneReader {
  constructor(
    @Inject(TONE_REPOSITORY)
    private readonly toneRepository: ToneRepositoryPort,
  ) {}

  async findOne(toneId: UniqueEntityId): Promise<Tones> {
    const tone = await this.toneRepository.findOne(toneId);
    return tone;
  }

  // NOTE: option이 필요하면 findMany로 분리
  async findAll(): Promise<Tones[]> {
    const tones = await this.toneRepository.findAll();
    return tones;
  }
}
