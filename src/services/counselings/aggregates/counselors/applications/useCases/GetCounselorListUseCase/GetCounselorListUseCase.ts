import { UseCase } from "~shared/core/applications/UseCase";
import { GetCounselorListUseCaseRequest } from "~counselings/aggregates/counselors/applications/useCases/GetCounselorListUseCase/dto/GetCounselorList.request";
import { GetCounselorListUseCaseResponse } from "~counselings/aggregates/counselors/applications/useCases/GetCounselorListUseCase/dto/GetCounselorList.response";
import {
  COUNSELOR_REPOSITORY,
  CounselorsRepositoryPort,
} from "~counselings/aggregates/counselors/infrastructures/counselors.repository.port";

import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class GetCounselorListUseCase
  implements UseCase<GetCounselorListUseCaseRequest, GetCounselorListUseCaseResponse>
{
  constructor(
    @Inject(COUNSELOR_REPOSITORY)
    private readonly counselorsRepository: CounselorsRepositoryPort,
  ) {}

  async execute(request: GetCounselorListUseCaseRequest): Promise<GetCounselorListUseCaseResponse> {
    const counselorList = await this.counselorsRepository.findMany({});
    return {
      ok: true,
      counselorList,
    };
  }
}
