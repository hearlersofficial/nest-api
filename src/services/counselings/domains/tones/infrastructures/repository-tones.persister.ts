import { TonesRepository } from "~counselings/domains/tones/infrastructures/tones.repository";
import { Tones, TonesNewProps } from "~counselings/domains/tones/models/tones";
import { TonesPersister } from "~counselings/domains/tones/tones.persister";

import { HttpStatus, Injectable } from "@nestjs/common";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";

@Injectable()
export class RepositoryTonesPersister extends TonesPersister {
  constructor(private readonly toneRepository: TonesRepository) {
    super();
  }

  override async create(newProps: TonesNewProps): Promise<Tones> {
    const toneResult = Tones.createNew(newProps);
    if (toneResult.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, toneResult.error as string);
    }
    return this.toneRepository.save(toneResult.value);
  }

  override async update(tone: Tones): Promise<Tones> {
    return this.toneRepository.save(tone);
  }

  override async updateMany(tones: Tones[]): Promise<Tones[]> {
    return this.toneRepository.save(tones);
  }
}
