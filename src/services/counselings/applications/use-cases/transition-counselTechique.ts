import { UseCase } from "~shared/core/applications/UseCase";
import {
  TransitionCounselTechniqueRequest,
  TransitionCounselTechniqueResponse,
} from "~counselings/applications/use-cases/dtos/transition-counselTechnique.dto";
import { CounselsService } from "~counselings/domains/counsels/counsels.service";
import { CounselTechniquesService } from "~counselings/domains/counselTechniques/counselTechniques.service";

import { Injectable } from "@nestjs/common";

@Injectable()
export class TransitionCounselTechniqueUseCase implements UseCase<TransitionCounselTechniqueRequest, TransitionCounselTechniqueResponse> {
  constructor(private readonly counselService: CounselsService, private readonly counselTechniqueService: CounselTechniquesService) {}

  async execute(request: TransitionCounselTechniqueRequest): Promise<TransitionCounselTechniqueResponse> {
    const { counsel } = request;

    const currentCounselTechnique = await this.counselTechniqueService.getOne({ counselTechniqueId: counsel.counselTechniqueId });

    // 다음 프롬프트가 정해진 경우
    if (currentCounselTechnique.nextTechniqueId) {
      const nextCounselTechnique = await this.counselTechniqueService.getOne({ counselTechniqueId: currentCounselTechnique.nextTechniqueId });

      counsel.updateCounselTechniqueId(nextCounselTechnique.id);
      await this.counselService.update(counsel);

      return {
        ok: true,
        counsel,
      };
    }
    // TODO: 마지막 프롬프트 인 경우
    else {
      return {
        ok: true,
        counsel,
      };
    }
  }
}
