import { PersonaPromptsRepository } from "~counselings/domains/personaPrompts/infrastructures/personaPrompts.repository";
import { PsqlPersonaPromptsRepository } from "~counselings/domains/personaPrompts/infrastructures/psql-personaPrompts.repository";
import { RepositoryPersonaPromptsReader } from "~counselings/domains/personaPrompts/infrastructures/repository-personaPrompts.reader";
import { RepositoryPersonaPromptsStore } from "~counselings/domains/personaPrompts/infrastructures/repository-personaPrompts.store";
import { PersonaPromptsReader } from "~counselings/domains/personaPrompts/personaPrompts.reader";
import { PersonaPromptsService } from "~counselings/domains/personaPrompts/personaPrompts.service";
import { PersonaPromptsStore } from "~counselings/domains/personaPrompts/personaPrompts.store";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PersonaPromptEntity } from "~common/system/persistences/entities/prompts/PersonaPrompts.entity";

@Module({
  imports: [TypeOrmModule.forFeature([PersonaPromptEntity])],
  providers: [
    PersonaPromptsService,
    {
      provide: PersonaPromptsRepository,
      useClass: PsqlPersonaPromptsRepository,
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
