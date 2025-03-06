import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { Counselors } from "~counselings/aggregates/counselors/domain/counselors";
import {
  COUNSELOR_REPOSITORY,
  CounselorsRepositoryPort,
} from "~counselings/aggregates/counselors/infrastructures/counselors.repository.port";

import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class CounselorReader {
  constructor(
    @Inject(COUNSELOR_REPOSITORY)
    private readonly counselorRepository: CounselorsRepositoryPort,
  ) {}

  async findOne(counselorId: UniqueEntityId): Promise<Counselors | null> {
    const counselor = await this.counselorRepository.findOne(counselorId);
    return counselor;
  }

  async findAll(): Promise<Counselors[]> {
    const counselors = await this.counselorRepository.findAll();
    return counselors;
  }

  async findMany(props: { name?: string; toneId?: UniqueEntityId }): Promise<Counselors[]> {
    const counselors = await this.counselorRepository.findMany(props);
    return counselors;
  }
}
