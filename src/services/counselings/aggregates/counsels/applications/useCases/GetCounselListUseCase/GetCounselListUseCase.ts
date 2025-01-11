import { UseCase } from "~shared/core/applications/UseCase";
import { GetCounselListUseCaseRequest } from "~counselings/aggregates/counsels/applications/useCases/GetCounselListUseCase/dto/GetCounselList.request";
import { GetCounselListUseCaseResponse } from "~counselings/aggregates/counsels/applications/useCases/GetCounselListUseCase/dto/GetCounselList.response";
import { Counsels } from "~counselings/aggregates/counsels/domain/Counsels";
import {
  COUNSEL_REPOSITORY,
  CounselsRepositoryPort,
} from "~counselings/aggregates/counsels/infrastructures/counsels.repository.port";

import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class GetCounselListUseCase implements UseCase<GetCounselListUseCaseRequest, GetCounselListUseCaseResponse> {
  constructor(
    @Inject(COUNSEL_REPOSITORY)
    private readonly counselsRepository: CounselsRepositoryPort,
  ) {}

  async execute(request: GetCounselListUseCaseRequest): Promise<GetCounselListUseCaseResponse> {
    const { userId } = request;
    const counselList: Counsels[] = await this.counselsRepository.findMany({ userId });
    return {
      ok: true,
      counselList,
    };
  }
}
