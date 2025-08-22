import { PersonaPromptsRepository } from "~counselings/domains/persona-prompts/infrastructures/persona-prompts.repository";
import { RepositoryPersonaPromptsReader } from "~counselings/domains/persona-prompts/infrastructures/repository-personaPrompts.reader";
import { RepositoryPersonaPromptsStore } from "~counselings/domains/persona-prompts/infrastructures/repository-personaPrompts.store";
import { TypeormPersonaPromptsRepository } from "~counselings/domains/persona-prompts/infrastructures/typeorm-persona-prompts.repository";
import { PersonaPromptsReader } from "~counselings/domains/persona-prompts/persona-prompts.reader";
import { PersonaPromptsService } from "~counselings/domains/persona-prompts/persona-prompts.service";
import { PersonaPromptsStore } from "~counselings/domains/persona-prompts/persona-prompts.store";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PersonaPromptEntity } from "~common/system/persistences/entities/prompts/PersonaPrompts.entity";

@Module({
  imports: [TypeOrmModule.forFeature([PersonaPromptEntity])],
  providers: [
    PersonaPromptsService,
    {
      provide: PersonaPromptsRepository,
      useClass: TypeormPersonaPromptsRepository,
    },
    {
      provide: PersonaPromptsReader,
      useClass: RepositoryPersonaPromptsReader,
    },
    {
      provide: PersonaPromptsStore,
      useClass: RepositoryPersonaPromptsStore,
    },
  ],
  exports: [PersonaPromptsService],
})
export class PersonaPromptsModule {}
