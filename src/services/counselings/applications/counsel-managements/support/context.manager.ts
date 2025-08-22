import { CounselSession } from "~counselings/applications/counsel-managements/models/counsel-session";
import { CounselTechniquesService } from "~counselings/domains/counsel-techniques/counsel-techniques.service";
import { CounselorsService } from "~counselings/domains/counselors/counselors.service";
import { CounselsService } from "~counselings/domains/counsels/counsels.service";
import { PersonaPromptsService } from "~counselings/domains/persona-prompts/persona-prompts.service";
import { PromptVersionsService } from "~counselings/domains/prompt-versions/prompt-versions.service";
import { TonePromptsService } from "~counselings/domains/tone-prompts/tone-prompts.service";

import { Injectable } from "@nestjs/common";
import { CounselId } from "~common/shared-kernel/identifiers/counsel.id";

@Injectable()
export class ContextManager {
  constructor(
    private readonly counselService: CounselsService,
    private readonly counselorService: CounselorsService,
    private readonly promptVersionsService: PromptVersionsService,
    private readonly counselTechniqueService: CounselTechniquesService,
    private readonly personaPromptsService: PersonaPromptsService,
    private readonly tonePromptsService: TonePromptsService,
  ) {}

  async buildCounselSession(counselId: CounselId): Promise<CounselSession> {
    // 병렬로 데이터 수집
    const { counsel, messages, compressedMessages } = await this.counselService.getSessionInfo({
      counselId,
    });

    const [counselor, promptVersion, currentTechnique] = await Promise.all([
      this.counselorService.getOne({ counselorId: counsel.counselorId }),
      this.promptVersionsService.getOne({ promptVersionId: counsel.promptVersionId }),
      this.counselTechniqueService.getOne({
        uniqueCriteria: { type: "counselTechnique", id: counsel.counselTechniqueId },
      }),
    ]);
    const [personaPrompt, tonePrompt] = await Promise.all([
      this.personaPromptsService.getOne({
        uniqueCriteria: {
          type: "versionAndCounselor",
          promptVersionId: counsel.promptVersionId,
          counselorId: counselor.id,
        },
      }),
      this.tonePromptsService.getOne({
        uniqueCriteria: {
          type: "versionAndTone",
          promptVersionId: counsel.promptVersionId,
          toneId: counselor.toneId,
        },
      }),
    ]);

    return new CounselSession({
      counsel,
      counselor,
      messages,
      compressedMessages,
      promptVersion,
      currentTechnique,
      personaPrompt,
      tonePrompt,
    });
  }
}
