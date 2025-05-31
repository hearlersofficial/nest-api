import { RepositoryToneCriteriaMapper } from "~counselings/domains/tones/infrastructures/mappers/repository-tones-criteria.mapper";
import { TonesRepository } from "~counselings/domains/tones/infrastructures/tones.repository";
import { Tones } from "~counselings/domains/tones/models/tones";
import { TonesCriteriaFindMany } from "~counselings/domains/tones/tones.criteria";
import { TonesReader } from "~counselings/domains/tones/tones.reader";

import { Injectable } from "@nestjs/common";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";

@Injectable()
export class RepositoryTonesReader extends TonesReader {
  constructor(private readonly toneRepository: TonesRepository) {
    super();
  }

  override async findOne(props: { toneId: UniqueEntityId }): Promise<Tones | null> {
    return this.toneRepository.findByToneId(props.toneId);
  }

  override async findMany(props: TonesCriteriaFindMany): Promise<Tones[]> {
    const typeormOptions = RepositoryToneCriteriaMapper.toFindManyOptions(props);
    return this.toneRepository.findMany(typeormOptions);
  }
}
