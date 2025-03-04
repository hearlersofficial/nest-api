import { PersonaEntity } from "~shared/core/infrastructure/entities/prompts/Personas.entity";
import { CreatePersonaHandler } from "~counselings/aggregates/personas/applications/commands/CreatePersona/CreatePersona.handler";
import { UpdatePersonaHandler } from "~counselings/aggregates/personas/applications/commands/UpdatePersona/UpdatePersona.handler";
import { PersonaService } from "~counselings/aggregates/personas/applications/persona.service";
import { FindPersonaByIdHandler } from "~counselings/aggregates/personas/applications/queries/FindPersonaById/FindPersonaById.handler";
import { FindPersonasHandler } from "~counselings/aggregates/personas/applications/queries/FindPersonas/FindPersonas.handler";
import { PersonaPersistor } from "~counselings/aggregates/personas/applications/tools/persona.persistor";
import { PersonaReader } from "~counselings/aggregates/personas/applications/tools/persona.reader";
import { PsqlPersonaRepositoryAdaptor } from "~counselings/aggregates/personas/infrastructures/adaptors/psql.persona.repository.adaptor";
import { PERSONA_REPOSITORY } from "~counselings/aggregates/personas/infrastructures/persona.repository.port";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([PersonaEntity])],
  providers: [
    PersonaService,
    PersonaReader,
    PersonaPersistor,
    FindPersonasHandler,
    FindPersonaByIdHandler,
    UpdatePersonaHandler,
    CreatePersonaHandler,
    {
      provide: PERSONA_REPOSITORY,
      useClass: PsqlPersonaRepositoryAdaptor,
    },
  ],
  exports: [PersonaService],
})
export class PersonasModule {}
