import { Tones, TonesNewProps } from "~counselings/domains/tones/models/tones";
import { TonesCriteriaFindMany } from "~counselings/domains/tones/tones.criteria";
import { TonesPersister } from "~counselings/domains/tones/tones.persister";
import { TonesReader } from "~counselings/domains/tones/tones.reader";

import { HttpStatus, Injectable } from "@nestjs/common";
import { UniqueEntityId } from "~common/shared-kernel/domains/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";

@Injectable()
export class TonesService {
  constructor(
    private readonly tonesReader: TonesReader,
    private readonly tonesPersister: TonesPersister,
  ) {}

  async create(newProps: TonesNewProps): Promise<Tones> {
    return this.tonesPersister.create(newProps);
  }

  async update(tone: Tones): Promise<Tones> {
    return this.tonesPersister.update(tone);
  }

  async findOne(props: { toneId: UniqueEntityId }): Promise<Tones | null> {
    return this.tonesReader.findOne(props);
  }

  async getOne(props: { toneId: UniqueEntityId }): Promise<Tones> {
    const tone = await this.findOne(props);
    if (!tone) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Tone not found");
    }
    return tone;
  }

  async findMany(props: TonesCriteriaFindMany): Promise<Tones[]> {
    return this.tonesReader.findMany(props);
  }
}
