import { UseCase } from "~/src/shared/core/applications/UseCase";
import { GetCounselUseCaseRequest } from "~counselings/aggregates/counsels/applications/useCases/GetCounselUseCase/dto/GetCounsel.request";
import { GetCounselUseCaseResponse } from "~counselings/aggregates/counsels/applications/useCases/GetCounselUseCase/dto/GetCounsel.response";
import { Counsels } from "~counselings/aggregates/counsels/domain/Counsels";
import {
  COUNSEL_REPOSITORY,
  CounselsRepositoryPort,
} from "~counselings/aggregates/counsels/infrastructures/counsels.repository.port";

import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class GetCounselUseCase implements UseCase<GetCounselUseCaseRequest, GetCounselUseCaseResponse> {
  constructor(
    @Inject(COUNSEL_REPOSITORY)
    private readonly counselsRepository: CounselsRepositoryPort,
  ) {}

  async execute(request: GetCounselUseCaseRequest): Promise<GetCounselUseCaseResponse> {
    const { counselId } = request;
    const counsel: Counsels = await this.counselsRepository.findOne({ counselId });
    return {
      ok: true,
      counsel,
    };
  }
}
