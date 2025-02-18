import { PersonaEntity } from "~shared/core/infrastructure/entities/prompts/Personas.entity";
import { PsqlPersonasRepositoryAdaptor } from "~counselings/aggregates/personas/infrastructures/adaptors/psql.personas.repository.adaptor";
import { PERSONA_REPOSITORY } from "~counselings/aggregates/personas/infrastructures/personas.repository.port";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([PersonaEntity])],
  providers: [
    {
      provide: PERSONA_REPOSITORY,
      useClass: PsqlPersonasRepositoryAdaptor,
    },
  ],
  exports: [],
})
export class PersonasModule {}
