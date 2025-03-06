import { ContextEntity } from "~shared/core/infrastructure/entities/prompts/Contexts.entity";
import { CreateContextHandler } from "~counselings/aggregates/contexts/applications/commands/CreateContext/CreateContext.handler";
import { UpdateContextHandler } from "~counselings/aggregates/contexts/applications/commands/UpdateContext/UpdateContext.handler";
import { ContextService } from "~counselings/aggregates/contexts/applications/context.service";
import { FindContextByIdHandler } from "~counselings/aggregates/contexts/applications/queries/FindContextById/FindContextById.handler";
import { FindContextsHandler } from "~counselings/aggregates/contexts/applications/queries/FindContexts/FindContexts.handler";
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
    CreateContextHandler,
    UpdateContextHandler,
    FindContextsHandler,
    FindContextByIdHandler,
    {
      provide: CONTEXT_REPOSITORY,
      useClass: PsqlContextRepositoryAdaptor,
    },
  ],
  exports: [ContextService],
})
export class ContextsModule {}
