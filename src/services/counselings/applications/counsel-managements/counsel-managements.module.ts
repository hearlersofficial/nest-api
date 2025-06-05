import { CounselManagementsFacade } from "~counselings/applications/counsel-managements/counsel-managements.facade";
import { ProceedCounselingUseCase } from "~counselings/applications/counsel-managements/use-cases/proceed-counseling";
import { CounselMessagesModule } from "~counselings/domains/counselMessages/counselMessages.module";
import { CounselorsModule } from "~counselings/domains/counselors/counselors.module";
import { CounselsModule } from "~counselings/domains/counsels/counsels.module";
import { CounselTechniquesModule } from "~counselings/domains/counselTechniques/counselTechniques.module";
import { LlmModule } from "~counselings/domains/llm/llm.module";
import { PersonaPromptsModule } from "~counselings/domains/personaPrompts/personaPrompts.module";
import { PromptVersionsModule } from "~counselings/domains/promptVersions/promptVersions.module";
import { TonePromptsModule } from "~counselings/domains/tonePrompts/tonePrompts.module";

import { Module } from "@nestjs/common";

@Module({
  imports: [
    CounselsModule,
    CounselMessagesModule,
    PromptVersionsModule,
    CounselorsModule,
    CounselTechniquesModule,
    PersonaPromptsModule,
    TonePromptsModule,
    LlmModule,
  ],
  providers: [
    // Facade
    CounselManagementsFacade,

    // use-cases
    ProceedCounselingUseCase,
  ],
  exports: [CounselManagementsFacade],
})
export class CounselManagementsModule {}
