import { CounselManagementsFacade } from "~counselings/applications/counsel-managements/counsel-managements.facade";
import { CounselingOrchestrator } from "~counselings/applications/counsel-managements/counseling.orchestrator";
import { AIResponseGenerator } from "~counselings/applications/counsel-managements/support/ai-response.generator";
import { ContextManager } from "~counselings/applications/counsel-managements/support/context.manager";
import { ConversationHistoryBuilder } from "~counselings/applications/counsel-managements/support/conversation-history.builder";
import { MessageManager } from "~counselings/applications/counsel-managements/support/message.manager";
import { SystemPromptBuilder } from "~counselings/applications/counsel-managements/support/system-prompt.builder";
import { TechniqueManager } from "~counselings/applications/counsel-managements/support/technique.manager";
import { TechniqueEvaluationParser } from "~counselings/applications/counsel-managements/support/technique-evaluation.parser";
import { CounselMessagesModule } from "~counselings/domains/counselMessages/counselMessages.module";
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
    CounselMessagesModule,
    PromptVersionsModule,
    CounselorsModule,
    CounselTechniquesModule,
    PersonaPromptsModule,
    TonePromptsModule,
    AssistantAgentModule.forRoot([], {
      modelName: "gpt-4o-mini",
      temperature: 0.5,
      maxToolCalls: 5,
      maxMemoryMessages: 10,
      streaming: true,
    }),
  ],
  providers: [
    // Facade
    CounselManagementsFacade,

    // Support Services
    AIResponseGenerator,
    ConversationHistoryBuilder,
    MessageManager,
    SystemPromptBuilder,
    TechniqueManager,
    TechniqueEvaluationParser,
    ContextManager,

    // Main Orchestrator
    CounselingOrchestrator,
  ],
  exports: [CounselManagementsFacade],
})
export class CounselManagementsModule {}
