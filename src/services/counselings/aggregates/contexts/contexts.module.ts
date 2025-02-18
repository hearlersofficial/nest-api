import { ContextEntity } from "~shared/core/infrastructure/entities/prompts/Contexts.entity";
import { PsqlContextsRepositoryAdaptor } from "~counselings/aggregates/contexts/infrastructures/adaptors/psql.contexts.repository.adaptor";
import { CONTEXT_REPOSITORY } from "~counselings/aggregates/contexts/infrastructures/contexts.repository.port";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([ContextEntity])],
  providers: [
    {
      provide: CONTEXT_REPOSITORY,
      useClass: PsqlContextsRepositoryAdaptor,
    },
  ],
  exports: [],
})
export class ContextsModule {}
