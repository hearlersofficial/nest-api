import { Counsels } from "~counselings/aggregates/counsels/domain/Counsels";
import { COUNSEL_REPOSITORY, CounselsRepositoryPort } from "~counselings/aggregates/counsels/infrastructures/counsels.repository.port";

import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class CounselPersister {
  constructor(
    @Inject(COUNSEL_REPOSITORY)
    private readonly counselRepository: CounselsRepositoryPort,
  ) {}

  async create(counsel: Counsels): Promise<Counsels> {
    const createdCounsel = await this.counselRepository.create(counsel);
    return createdCounsel;
  }

  async update(counsel: Counsels): Promise<Counsels> {
    const updatedCounsel = await this.counselRepository.update(counsel);
    return updatedCounsel;
  }
}
