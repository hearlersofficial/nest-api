import { UseCase } from "~shared/core/applications/UseCase";
import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import {
  GetOrderedCounselTechniquesUseCaseRequest,
  GetOrderedCounselTechniquesUseCaseResponse,
} from "~counselings/applications/use-cases/dtos/get-ordered-counselTechniques.dto";
import { CounselTechniquesService } from "~counselings/domains/counselTechniques/counselTechniques.service";
import { CounselTechniques } from "~counselings/domains/counselTechniques/models/counselTechniques";

import { Injectable } from "@nestjs/common";

@Injectable()
export class GetOrderedCounselTechniquesUseCase implements UseCase<GetOrderedCounselTechniquesUseCaseRequest, GetOrderedCounselTechniquesUseCaseResponse> {
  constructor(private readonly counselTechniquesService: CounselTechniquesService) {}

  async execute(request: GetOrderedCounselTechniquesUseCaseRequest): Promise<GetOrderedCounselTechniquesUseCaseResponse> {
    const { firstCounselTechniqueId } = request;
    const counselTechniques = await this.getNextCounselTechniques(firstCounselTechniqueId);
    return {
      ok: true,
      counselTechniques,
    };
  }

  private async getNextCounselTechniques(firstCounselTechniqueId: UniqueEntityId): Promise<CounselTechniques[]> {
    const firstCounselTechnique = await this.counselTechniquesService.getOne({ counselTechniqueId: firstCounselTechniqueId });
    if (!firstCounselTechnique.nextTechniqueId) {
      return [firstCounselTechnique];
    }
    const nextCounselTechniques = await this.getNextCounselTechniques(firstCounselTechnique.nextTechniqueId);
    return [firstCounselTechnique, ...nextCounselTechniques];
  }
}
