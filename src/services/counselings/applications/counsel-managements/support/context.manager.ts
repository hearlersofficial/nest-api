import { CounselSession } from "~counselings/applications/counsel-managements/models/counsel-session";
import { CompressedContextService } from "~counselings/domains/compressedContext/compressedContext.service";
import { CounselorsService } from "~counselings/domains/counselors/counselors.service";
import { CounselsService } from "~counselings/domains/counsels/counsels.service";
import { CounselTechniquesService } from "~counselings/domains/counselTechniques/counselTechniques.service";
import { PromptVersionsService } from "~counselings/domains/promptVersions/promptVersions.service";

import { Injectable } from "@nestjs/common";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";
import { CounselId } from "~common/shared-kernel/identifiers/counsel.id";

@Injectable()
export class ContextManager {
  constructor(
    private readonly counselService: CounselsService,
    private readonly counselorService: CounselorsService,
    private readonly promptVersionsService: PromptVersionsService,
    private readonly counselTechniqueService: CounselTechniquesService,
    private readonly compressedContextService: CompressedContextService,
  ) {}

  async buildCounselSession(counselId: CounselId): Promise<CounselSession> {
    // 병렬로 데이터 수집
    const { counsel, messages: counselMessages } = await this.counselService.getOneWithMessages({ counselId });

    const [counselor, promptVersion, currentTechnique] = await Promise.all([
      this.counselorService.getOne({ counselorId: new UniqueEntityId(counsel.counselorId) }),
      this.promptVersionsService.getOne({ promptVersionId: new UniqueEntityId(counsel.promptVersionId) }),
      this.counselTechniqueService.getOne({ counselTechniqueId: new UniqueEntityId(counsel.counselTechniqueId) }),
    ]);

    const compressedContexts = await this.compressedContextService.getMany({
      counselId: counsel.id,
    });

    return new CounselSession({
      counsel,
      counselor,
      messages: counselMessages,
      promptVersion,
      currentTechnique,
      compressedContexts,
    });
  }
}
