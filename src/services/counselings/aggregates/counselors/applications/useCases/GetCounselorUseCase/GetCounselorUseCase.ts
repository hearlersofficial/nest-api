import { UseCase } from "~shared/core/applications/UseCase";
import { GetCounselorUseCaseRequest } from "~counselings/aggregates/counselors/applications/useCases/GetCounselorUseCase/dto/GetCounselorUseCase.request";
import { GetCounselorUseCaseResponse } from "~counselings/aggregates/counselors/applications/useCases/GetCounselorUseCase/dto/GetCounselorUseCase.response";
import {
  COUNSELOR_REPOSITORY,
  CounselorsRepositoryPort,
} from "~counselings/aggregates/counselors/infrastructures/counselors.repository.port";

import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class GetCounselorUseCase implements UseCase<GetCounselorUseCaseRequest, GetCounselorUseCaseResponse> {
  constructor(
    @Inject(COUNSELOR_REPOSITORY)
    private readonly counselorsRepository: CounselorsRepositoryPort,
  ) {}

  async execute(request: GetCounselorUseCaseRequest): Promise<GetCounselorUseCaseResponse> {
    const { counselorId } = request;
    const counselor = await this.counselorsRepository.findOne(counselorId);
    return {
      ok: true,
      counselor,
    };
  }
}
