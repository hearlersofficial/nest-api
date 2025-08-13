import { RepositoryToneCriteriaMapper } from "~counselings/domains/tones/infrastructures/mappers/repository-tones-criteria.mapper";
import { TonesRepository } from "~counselings/domains/tones/infrastructures/tones.repository";
import { Tones } from "~counselings/domains/tones/models/tones";
import { TonesCriteriaFindMany } from "~counselings/domains/tones/tones.criteria";
import { TonesReader } from "~counselings/domains/tones/tones.reader";

import { HttpStatus, Injectable } from "@nestjs/common";
import { ToneId } from "~common/shared-kernel/identifiers/tone.id";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";

@Injectable()
export class RepositoryTonesReader extends TonesReader {
  constructor(private readonly toneRepository: TonesRepository) {
    super();
  }

  override async findOne(props: { toneId: ToneId }): Promise<Tones | null> {
    return this.toneRepository.findByToneId(props.toneId);
  }

  override async getOne(props: { toneId: ToneId }): Promise<Tones> {
    const tone = await this.toneRepository.findByToneId(props.toneId);
    if (!tone) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Tone not found");
    }
    return tone;
  }

  override async findMany(props: TonesCriteriaFindMany): Promise<Tones[]> {
    const typeormOptions = RepositoryToneCriteriaMapper.toFindManyOptions(props);
    return this.toneRepository.findMany(typeormOptions);
  }
}
