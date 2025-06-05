import { CounselPromptManagementsFacade } from "~counselings/applications/counsel-prompt-managements/counsel-prompt-managements.facade";
import { ValidatePromptVersionUseCase } from "~counselings/applications/counsel-prompt-managements/use-cases/validate-prompt-version";
import { CounselorsModule } from "~counselings/domains/counselors/counselors.module";
import { CounselTechniquesModule } from "~counselings/domains/counselTechniques/counselTechniques.module";
import { LlmModule } from "~counselings/domains/llm/llm.module";
import { PersonaPromptsModule } from "~counselings/domains/personaPrompts/personaPrompts.module";
import { PromptActivateHistoryModule } from "~counselings/domains/promptActivateHistory/promptActivateHistory.module";
import { PromptVersionsModule } from "~counselings/domains/promptVersions/promptVersions.module";
import { TonePromptsModule } from "~counselings/domains/tonePrompts/tonePrompts.module";
import { TonesModule } from "~counselings/domains/tones/tones.module";

import { Module } from "@nestjs/common";

@Module({
  imports: [
    PromptVersionsModule,
    PersonaPromptsModule,
    TonePromptsModule,
    CounselTechniquesModule,
    PromptActivateHistoryModule,
    LlmModule,
    TonesModule,
    CounselorsModule,
  ],
  providers: [
    // Facade
    CounselPromptManagementsFacade,

    // use-cases
    ValidatePromptVersionUseCase,
  ],
  exports: [CounselPromptManagementsFacade],
})
export class CounselPromptManagementsModule {}
