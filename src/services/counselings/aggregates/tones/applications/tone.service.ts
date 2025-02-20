import { TonePersistor } from "~counselings/aggregates/tones/applications/tools/tone.persistor";
import { ToneReader } from "~counselings/aggregates/tones/applications/tools/tone.reader";
import { Tones } from "~counselings/aggregates/tones/domain/tones";

import { Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class ToneService {
  constructor(private readonly toneReader: ToneReader, private readonly tonePersistor: TonePersistor) {}

  async create(tone: Tones): Promise<Tones> {
    const createdTone = await this.tonePersistor.create(tone);
    return createdTone;
  }

  async update(tone: Tones): Promise<Tones> {
    const updatedTone = await this.tonePersistor.update(tone);
    return updatedTone;
  }

  async findOne(toneId: string): Promise<Tones> {
    const tone = await this.toneReader.findOne(toneId);
    return tone;
  }

  async findAll(): Promise<Tones[]> {
    const tones = await this.toneReader.findAll();
    return tones;
  }

  async getOne(toneId: string): Promise<Tones> {
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
}
