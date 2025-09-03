import { CounselSession } from "~counselings/applications/counsel-managements/models/counsel-session";
import { CounselTechniquesService } from "~counselings/domains/counsel-techniques/counsel-techniques.service";

import { Injectable } from "@nestjs/common";

@Injectable()
export class CounselTechniquesTransitionExecutor {
  constructor(private readonly counselTechniquesService: CounselTechniquesService) {}

  async evaluateTransition(counselSession: CounselSession) {
    const counselTechniqueTransitionRules = await this.counselTechniquesService.findManyTransitionRules({
      promptVersionId: counselSession.promptVersion.id,
      fromCounselTechniqueId: counselSession.currentTechnique.id,
    });

    for (const rule of counselTechniqueTransitionRules) {
    }
  }
}
