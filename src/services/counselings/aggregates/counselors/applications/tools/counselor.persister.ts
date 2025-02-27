import { Counselors } from "~counselings/aggregates/counselors/domain/counselors";
import { COUNSELOR_REPOSITORY, CounselorsRepositoryPort } from "~counselings/aggregates/counselors/infrastructures/counselors.repository.port";

import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class CounselorPersister {
  constructor(
    @Inject(COUNSELOR_REPOSITORY)
    private readonly counselorRepository: CounselorsRepositoryPort,
  ) {}

  async create(counselor: Counselors): Promise<Counselors> {
    const createdCounselor = await this.counselorRepository.create(counselor);
    return createdCounselor;
  }

  async update(counselor: Counselors): Promise<Counselors> {
    const updatedCounselor = await this.counselorRepository.update(counselor);
    return updatedCounselor;
  }
}
