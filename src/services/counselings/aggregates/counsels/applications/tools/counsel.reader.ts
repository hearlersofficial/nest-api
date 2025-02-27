import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { Counsels } from "~counselings/aggregates/counsels/domain/Counsels";
import { COUNSEL_REPOSITORY, CounselsRepositoryPort } from "~counselings/aggregates/counsels/infrastructures/counsels.repository.port";

import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class CounselReader {
  constructor(
    @Inject(COUNSEL_REPOSITORY)
    private readonly counselRepository: CounselsRepositoryPort,
  ) {}

  async findOne(counselId: UniqueEntityId): Promise<Counsels> {
    const counsel = await this.counselRepository.findOne(counselId);
    return counsel;
  }

  async findAll(): Promise<Counsels[]> {
    const counsels = await this.counselRepository.findAll();
    return counsels;
  }

  async findMany(props: { userId?: UniqueEntityId }): Promise<Counsels[]> {
    const counsels = await this.counselRepository.findMany(props);
    return counsels;
  }
}
