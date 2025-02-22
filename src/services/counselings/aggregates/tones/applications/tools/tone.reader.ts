import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { Tones } from "~counselings/aggregates/tones/domain/tones";
import { TONE_REPOSITORY, ToneRepositoryPort } from "~counselings/aggregates/tones/infrastructures/tones.repository.port";

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

  async findAll(): Promise<Tones[]> {
    const tones = await this.toneRepository.findAll();
    return tones;
  }

  async findMany(props: { name?: string }): Promise<Tones[]> {
    const tones = await this.toneRepository.findMany(props);
    return tones;
  }
}
