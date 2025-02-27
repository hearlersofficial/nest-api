import { UseCase } from "~shared/core/applications/UseCase";
import { Result } from "~shared/core/domain/Result";
import { CreateCounselUseCaseRequest } from "~counselings/aggregates/counsels/applications/useCases/CreateCounselUseCase/dto/CreateCounsel.request";
import { CreateCounselUseCaseResponse } from "~counselings/aggregates/counsels/applications/useCases/CreateCounselUseCase/dto/CreateCounsel.response";
import { Counsels } from "~counselings/aggregates/counsels/domain/Counsels";
import {
  COUNSEL_REPOSITORY,
  CounselsRepositoryPort,
} from "~counselings/aggregates/counsels/infrastructures/counsels.repository.port";

import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class CreateCounselUseCase implements UseCase<CreateCounselUseCaseRequest, CreateCounselUseCaseResponse> {
  constructor(
    @Inject(COUNSEL_REPOSITORY)
    private readonly counselsRepository: CounselsRepositoryPort,
  ) {}

  async execute(request: CreateCounselUseCaseRequest): Promise<CreateCounselUseCaseResponse> {
    const { userId, counselorId, counselTechniqueId } = request;
    const counselOrError: Result<Counsels> = Counsels.createNew({ userId, counselorId, counselTechniqueId });
    if (counselOrError.isFailure) {
      return {
        ok: false,
        error: counselOrError.error,
      };
    }
    const counsel: Counsels = counselOrError.value;
    const savedCounsel: Counsels = await this.counselsRepository.create(counsel);
    return {
      ok: true,
      counsel: savedCounsel,
    };
  }
}
