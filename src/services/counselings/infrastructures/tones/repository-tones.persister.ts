import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { Tones, TonesNewProps } from "~counselings/domains/tones/models/tones";
import { TonesPersister } from "~counselings/domains/tones/tones.persister";
import { TonesRepository } from "~counselings/infrastructures/tones/tones.repository";

import { HttpStatus, Injectable } from "@nestjs/common";

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
