import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { TonePersistor } from "~counselings/aggregates/tones/applications/tools/tone.persistor";
import { ToneReader } from "~counselings/aggregates/tones/applications/tools/tone.reader";
import { Tones, TonesNewProps } from "~counselings/aggregates/tones/domain/tones";

import { HttpStatus, Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class ToneService {
  constructor(private readonly toneReader: ToneReader, private readonly tonePersistor: TonePersistor) {}

  async create(toneNewProps: TonesNewProps): Promise<Tones> {
    const toneOrError = Tones.createNew(toneNewProps);
    if (toneOrError.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, toneOrError.error);
    }
    const tone = toneOrError.value;
    const createdTone = await this.tonePersistor.create(tone);
    return createdTone;
  }

  async update(tone: Tones): Promise<Tones> {
    const updatedTone = await this.tonePersistor.update(tone);
    return updatedTone;
  }

  async findOne(toneId: UniqueEntityId): Promise<Tones> {
    const tone = await this.toneReader.findOne(toneId);
    return tone;
  }

  async findAll(): Promise<Tones[]> {
    const tones = await this.toneReader.findAll();
    return tones;
  }

  async findMany(props: { name?: string }): Promise<Tones[]> {
    const tones = await this.toneReader.findMany(props);
    return tones;
  }

  async getOne(toneId: UniqueEntityId): Promise<Tones> {
    const tone: Tones | null = await this.findOne(toneId);
    if (!tone) {
      throw new NotFoundException("Tone not found");
    }
    return tone;
  }

  async getAll(): Promise<Tones[]> {
    const tones = await this.findAll();
    if (tones.length === 0) {
      throw new NotFoundException("Tones not found");
    }
    return tones;
  }

  async getMany(props: { name?: string }): Promise<Tones[]> {
    const tones = await this.findMany(props);
    if (tones.length === 0) {
      throw new NotFoundException("Tones not found");
    }
    return tones;
  }
}
