import { CounselSession } from "~counselings/applications/counsel-managements/models/counsel-session";
import { CounselMessagesService } from "~counselings/domains/counselMessages/counselMessages.service";
import { CounselorsService } from "~counselings/domains/counselors/counselors.service";
import { CounselsService } from "~counselings/domains/counsels/counsels.service";
import { CounselTechniquesService } from "~counselings/domains/counselTechniques/counselTechniques.service";
import { PromptVersionsService } from "~counselings/domains/promptVersions/promptVersions.service";

import { Injectable } from "@nestjs/common";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";

@Injectable()
export class ContextManager {
  constructor(
    private readonly counselService: CounselsService,
    private readonly counselMessageService: CounselMessagesService,
    private readonly counselorService: CounselorsService,
    private readonly promptVersionsService: PromptVersionsService,
    private readonly counselTechniqueService: CounselTechniquesService,
  ) {}

  async buildCounselSession(counselId: UniqueEntityId): Promise<CounselSession> {
    // 병렬로 데이터 수집
    const [counsel, counselMessages] = await Promise.all([
      this.counselService.getOne({ counselId }),
      this.counselMessageService.getMany({ counselId }),
    ]);

    const [counselor, promptVersion, currentTechnique] = await Promise.all([
      this.counselorService.getOne({ counselorId: new UniqueEntityId(counsel.counselorId) }),
      this.promptVersionsService.getOne({ promptVersionId: new UniqueEntityId(counsel.promptVersionId) }),
      this.counselTechniqueService.getOne({ counselTechniqueId: new UniqueEntityId(counsel.counselTechniqueId) }),
    ]);

    return new CounselSession({
      counsel,
      counselor,
      messages: counselMessages,
      promptVersion,
      currentTechnique,
    });
  }
}
