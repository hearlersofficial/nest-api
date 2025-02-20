import { PersonaEntity } from "~shared/core/infrastructure/entities/prompts/Personas.entity";
import { PersonaService } from "~counselings/aggregates/personas/applications/persona.service";
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
    {
      provide: PERSONA_REPOSITORY,
      useClass: PsqlPersonaRepositoryAdaptor,
    },
  ],
  exports: [PersonaService],
})
export class PersonasModule {}
