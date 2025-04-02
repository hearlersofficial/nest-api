import { PersonaPromptEntity } from "~shared/core/infrastructure/entities/prompts/PersonaPrompts.entity";
import { PersonaPromptsPersister } from "~counselings/domains/personaPrompts/personaPrompts.persister";
import { PersonaPromptsReader } from "~counselings/domains/personaPrompts/personaPrompts.reader";
import { PersonaPromptsService } from "~counselings/domains/personaPrompts/personaPrompts.service";
import { PersonaPromptsRepository } from "~counselings/infrastructures/personaPrompts/personaPrompts.repository";
import { PsqlPersonaPromptsRepository } from "~counselings/infrastructures/personaPrompts/psql-personaPrompts.repository";
import { RepositoryPersonaPromptsPersister } from "~counselings/infrastructures/personaPrompts/repository-personaPrompts.persister";
import { RepositoryPersonaPromptsReader } from "~counselings/infrastructures/personaPrompts/repository-personaPrompts.reader";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

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
      provide: PersonaPromptsPersister,
      useClass: RepositoryPersonaPromptsPersister,
    },
  ],
  exports: [PersonaPromptsService],
})
export class PersonaPromptsModule {}
