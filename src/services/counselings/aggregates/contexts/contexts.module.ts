import { ContextEntity } from "~shared/core/infrastructure/entities/prompts/Contexts.entity";
import { ContextService } from "~counselings/aggregates/contexts/applications/context.service";
import { ContextPersistor } from "~counselings/aggregates/contexts/applications/tools/context.persistor";
import { ContextReader } from "~counselings/aggregates/contexts/applications/tools/context.reader";
import { PsqlContextRepositoryAdaptor } from "~counselings/aggregates/contexts/infrastructures/adaptors/psql.context.repository.adaptor";
import { CONTEXT_REPOSITORY } from "~counselings/aggregates/contexts/infrastructures/context.repository.port";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([ContextEntity])],
  providers: [
    ContextPersistor,
    ContextReader,
    ContextService,
    {
      provide: CONTEXT_REPOSITORY,
      useClass: PsqlContextRepositoryAdaptor,
    },
  ],
  exports: [ContextService],
})
export class ContextsModule {}
