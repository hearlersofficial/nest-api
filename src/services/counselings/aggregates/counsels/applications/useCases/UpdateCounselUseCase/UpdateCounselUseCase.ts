import { UseCase } from "~shared/core/applications/UseCase";
import { UpdateCounselUseCaseRequest } from "~counselings/aggregates/counsels/applications/useCases/UpdateCounselUseCase/dto/UpdateCounsel.request";
import { UpdateCounselUseCaseResponse } from "~counselings/aggregates/counsels/applications/useCases/UpdateCounselUseCase/dto/UpdateCounsel.response";
import {
  COUNSEL_REPOSITORY,
  CounselsRepositoryPort,
} from "~counselings/aggregates/counsels/infrastructures/counsels.repository.port";

import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class UpdateCounselUseCase implements UseCase<UpdateCounselUseCaseRequest, UpdateCounselUseCaseResponse> {
  constructor(
    @Inject(COUNSEL_REPOSITORY)
    private readonly counselsRepository: CounselsRepositoryPort,
  ) {}

  async execute(request?: UpdateCounselUseCaseRequest): Promise<UpdateCounselUseCaseResponse> {
    const { toUpdateCounsel } = request;

    const savedCounsel = await this.counselsRepository.update(toUpdateCounsel);
    return {
      ok: true,
      counsel: savedCounsel,
    };
  }
}
