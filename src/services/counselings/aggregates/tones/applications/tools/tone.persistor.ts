import { Tones } from "~counselings/aggregates/tones/domain/tones";
import {
  TONE_REPOSITORY,
  ToneRepositoryPort,
} from "~counselings/aggregates/tones/infrastructures/tones.repository.port";

import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class TonePersistor {
  constructor(
    @Inject(TONE_REPOSITORY)
    private readonly toneRepository: ToneRepositoryPort,
  ) {}

  async create(tone: Tones): Promise<Tones> {
    const createdTone = await this.toneRepository.create(tone);
    return createdTone;
  }

  async update(tone: Tones): Promise<Tones> {
    const updatedTone = await this.toneRepository.update(tone);
    return updatedTone;
  }
}
