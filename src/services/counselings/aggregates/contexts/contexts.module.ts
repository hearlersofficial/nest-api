import { ContextEntity } from "~shared/core/infrastructure/entities/prompts/Contexts.entity";
import { PsqlContextRepositoryAdaptor } from "~counselings/aggregates/contexts/infrastructures/adaptors/psql.context.repository.adaptor";
import { CONTEXT_REPOSITORY } from "~counselings/aggregates/contexts/infrastructures/context.repository.port";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([ContextEntity])],
  providers: [
    {
      provide: CONTEXT_REPOSITORY,
      useClass: PsqlContextRepositoryAdaptor,
    },
  ],
  exports: [],
})
export class ContextsModule {}
