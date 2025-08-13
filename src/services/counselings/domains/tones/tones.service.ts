import { TonesNewProps } from "~counselings/domains/tones/models/tones";
import { TonesInfo } from "~counselings/domains/tones/models/tones.info";
import { TonesCriteriaFindMany } from "~counselings/domains/tones/tones.criteria";
import { TonesPersister } from "~counselings/domains/tones/tones.persister";
import { TonesReader } from "~counselings/domains/tones/tones.reader";

import { HttpStatus, Injectable } from "@nestjs/common";
import { ToneId } from "~common/shared-kernel/identifiers/tone.id";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class TonesService {
  constructor(
    private readonly tonesReader: TonesReader,
    private readonly tonesPersister: TonesPersister,
  ) {}

  @Transactional()
  async create(newProps: TonesNewProps): Promise<TonesInfo> {
    const tone = await this.tonesPersister.create(newProps);
    return TonesInfo.fromDomain(tone);
  }

  @Transactional()
  async updateTone(params: { toneId: ToneId; name?: string; description?: string }): Promise<TonesInfo> {
    const { toneId, name, description } = params;
    const tone = await this.tonesReader.getOne({ toneId });

    tone.update({ name, description });

    const validateResult = tone.validateDomain();
    if (validateResult.isFailureResult()) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, validateResult.error);
    }

    const updatedTone = await this.tonesPersister.update(tone);
    return TonesInfo.fromDomain(updatedTone);
  }

  async findOne(props: { toneId: ToneId }): Promise<TonesInfo | null> {
    const tone = await this.tonesReader.findOne(props);
    return tone ? TonesInfo.fromDomain(tone) : null;
  }

  async getOne(props: { toneId: ToneId }): Promise<TonesInfo> {
    const tone = await this.findOne(props);
    if (!tone) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Tone not found");
    }
    return tone;
  }

  async findMany(props: TonesCriteriaFindMany): Promise<TonesInfo[]> {
    const tones = await this.tonesReader.findMany(props);
    return TonesInfo.fromDomainArray(tones);
  }
}
