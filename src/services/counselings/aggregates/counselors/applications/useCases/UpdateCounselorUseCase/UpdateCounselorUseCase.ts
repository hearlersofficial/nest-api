import { UseCase } from "~shared/core/applications/UseCase";
import { UpdateCounselorUseCaseRequest } from "~counselings/aggregates/counselors/applications/useCases/UpdateCounselorUseCase/dto/UpdateCounselor.request";
import { UpdateCounselorUseCaseResponse } from "~counselings/aggregates/counselors/applications/useCases/UpdateCounselorUseCase/dto/UpdateCounselor.response";
import {
  COUNSELOR_REPOSITORY,
  CounselorsRepositoryPort,
} from "~counselings/aggregates/counselors/infrastructures/counselors.repository.port";

import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class UpdateCounselorUseCase implements UseCase<UpdateCounselorUseCaseRequest, UpdateCounselorUseCaseResponse> {
  constructor(
    @Inject(COUNSELOR_REPOSITORY)
    private readonly counselorsRepository: CounselorsRepositoryPort,
  ) {}

  async execute(request: UpdateCounselorUseCaseRequest): Promise<UpdateCounselorUseCaseResponse> {
    const { toUpdateCounselor } = request;

    const savedCounselor = await this.counselorsRepository.update(toUpdateCounselor);
    return {
      ok: true,
      counselor: savedCounselor,
    };
  }
}
