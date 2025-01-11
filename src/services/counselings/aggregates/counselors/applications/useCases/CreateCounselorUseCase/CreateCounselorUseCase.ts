import { UseCase } from "~shared/core/applications/UseCase";
import { Result } from "~shared/core/domain/Result";
import { CreateCounselorUseCaseRequest } from "~counselings/aggregates/counselors/applications/useCases/CreateCounselorUseCase/dto/CreateCounselor.request";
import { CreateCounselorUseCaseResponse } from "~counselings/aggregates/counselors/applications/useCases/CreateCounselorUseCase/dto/CreateCounselor.response";
import { Counselors } from "~counselings/aggregates/counselors/domain/counselors";
import {
  COUNSELOR_REPOSITORY,
  CounselorsRepositoryPort,
} from "~counselings/aggregates/counselors/infrastructures/counselors.repository.port";

import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class CreateCounselorUseCase implements UseCase<CreateCounselorUseCaseRequest, CreateCounselorUseCaseResponse> {
  constructor(
    @Inject(COUNSELOR_REPOSITORY)
    private readonly counselorsRepository: CounselorsRepositoryPort,
  ) {}

  async execute(request: CreateCounselorUseCaseRequest): Promise<CreateCounselorUseCaseResponse> {
    const { counselorType, name, description, gender } = request;
    const counselorOrError: Result<Counselors> = Counselors.createNew({ counselorType, name, gender, description });
    if (counselorOrError.isFailure) {
      return {
        ok: false,
        error: counselorOrError.error,
      };
    }
    const counselor: Counselors = counselorOrError.value;
    const savedCounselor: Counselors = await this.counselorsRepository.create(counselor);
    return {
      ok: true,
      counselor: savedCounselor,
    };
  }
}
