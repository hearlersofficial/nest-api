import { UseCase } from "~shared/core/applications/UseCase";
import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import {
  GetOrderedCounselTechniquesUseCaseRequest,
  GetOrderedCounselTechniquesUseCaseResponse,
} from "~counselings/applications/use-cases/dtos/get-ordered-counselTechniques.dto";
import { CounselTechniquesService } from "~counselings/domains/counselTechniques/counselTechniques.service";
import { CounselTechniques } from "~counselings/domains/counselTechniques/models/counselTechniques";

import { HttpStatus, Injectable } from "@nestjs/common";

@Injectable()
export class GetOrderedCounselTechniquesUseCase implements UseCase<GetOrderedCounselTechniquesUseCaseRequest, GetOrderedCounselTechniquesUseCaseResponse> {
  constructor(private readonly counselTechniquesService: CounselTechniquesService) {}

  async execute(request: GetOrderedCounselTechniquesUseCaseRequest): Promise<GetOrderedCounselTechniquesUseCaseResponse> {
    const { firstCounselTechniqueId } = request;
    const visited = new Set<string>();
    const counselTechniques = await this.getNextCounselTechniques(firstCounselTechniqueId, visited);
    return {
      ok: true,
      counselTechniques,
    };
  }

  private async getNextCounselTechniques(firstCounselTechniqueId: UniqueEntityId, visited: Set<string>): Promise<CounselTechniques[]> {
    if (visited.has(firstCounselTechniqueId.getString())) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, "Circular reference detected in counsel techniques.");
    }
    visited.add(firstCounselTechniqueId.getString());

    const firstCounselTechnique = await this.counselTechniquesService.getOne({ counselTechniqueId: firstCounselTechniqueId });
    if (!firstCounselTechnique.nextTechniqueId) {
      return [firstCounselTechnique];
    }
    const nextCounselTechniques = await this.getNextCounselTechniques(firstCounselTechnique.nextTechniqueId, visited);
    return [firstCounselTechnique, ...nextCounselTechniques];
  }
}
