import { CounselManagementsFacade } from "~counselings/applications/counsel-managements/counsel-managements.facade";
import { CounselingOrchestrator } from "~counselings/applications/counsel-managements/counseling.orchestrator";
import { AIResponseGenerator } from "~counselings/applications/counsel-managements/support/ai-response.generator";
import { ContextManager } from "~counselings/applications/counsel-managements/support/context.manager";
import { SystemPromptBuilder } from "~counselings/applications/counsel-managements/support/system-prompt.builder";
import { TechniqueEvaluationParser } from "~counselings/applications/counsel-managements/support/technique-evaluation.parser";
import { CounselorsModule } from "~counselings/domains/counselors/counselors.module";
import { CounselsModule } from "~counselings/domains/counsels/counsels.module";
import { CounselTechniquesModule } from "~counselings/domains/counselTechniques/counselTechniques.module";
import { PersonaPromptsModule } from "~counselings/domains/personaPrompts/personaPrompts.module";
import { PromptVersionsModule } from "~counselings/domains/promptVersions/promptVersions.module";
import { TonePromptsModule } from "~counselings/domains/tonePrompts/tonePrompts.module";

import { Module } from "@nestjs/common";
import { AssistantAgentModule } from "~common/support/assistant-agents/assistant-agent.module";

@Module({
  imports: [
    CounselsModule,
    PromptVersionsModule,
    CounselorsModule,
    CounselTechniquesModule,
    PersonaPromptsModule,
    TonePromptsModule,
    AssistantAgentModule,
  ],
  providers: [
    // Facade
    CounselManagementsFacade,

    // Support Services
    AIResponseGenerator,
    SystemPromptBuilder,
    TechniqueEvaluationParser,
    ContextManager,

    // Main Orchestrator
    CounselingOrchestrator,
  ],
  exports: [CounselManagementsFacade],
})
export class CounselManagementsModule {}
