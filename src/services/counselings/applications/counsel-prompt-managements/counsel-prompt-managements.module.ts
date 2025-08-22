import { CounselPromptManagementsFacade } from "~counselings/applications/counsel-prompt-managements/counsel-prompt-managements.facade";
import { TemporaryVersionManager } from "~counselings/applications/counsel-prompt-managements/temporary-version.manager";
import { ValidatePromptVersionUseCase } from "~counselings/applications/counsel-prompt-managements/use-cases/validate-prompt-version";
import { CounselTechniquesModule } from "~counselings/domains/counsel-techniques/counsel-techniques.module";
import { CounselorsModule } from "~counselings/domains/counselors/counselors.module";
import { PersonaPromptsModule } from "~counselings/domains/persona-prompts/persona-prompts.module";
import { PromptActivateHistoryModule } from "~counselings/domains/prompt-activate-history/prompt-activate-history.module";
import { PromptVersionsModule } from "~counselings/domains/prompt-versions/prompt-versions.module";
import { TonePromptsModule } from "~counselings/domains/tone-prompts/tone-prompts.module";
import { TonesModule } from "~counselings/domains/tones/tones.module";

import { Module } from "@nestjs/common";
import { AssistantAgentModule } from "~common/support/assistant-agents/assistant-agent.module";

@Module({
  imports: [
    PromptVersionsModule,
    PersonaPromptsModule,
    TonePromptsModule,
    CounselTechniquesModule,
    PromptActivateHistoryModule,
    TonesModule,
    CounselorsModule,
    AssistantAgentModule,
  ],
  providers: [
    // Facade
    CounselPromptManagementsFacade,

    // use-cases
    ValidatePromptVersionUseCase,

    TemporaryVersionManager,
  ],
  exports: [CounselPromptManagementsFacade],
})
export class CounselPromptManagementsModule {}
