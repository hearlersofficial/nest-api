import { ContextEntity } from "~shared/core/infrastructure/entities/prompts/Contexts.entity";
import { ContextsPersister } from "~counselings/domains/contexts/contexts.persister";
import { ContextsReader } from "~counselings/domains/contexts/contexts.reader";
import { ContextsService } from "~counselings/domains/contexts/contexts.service";
import { ContextsRepository } from "~counselings/infrastructures/contexts/contexts.repository";
import { PsqlContextsRepository } from "~counselings/infrastructures/contexts/psql-contexts.repository";
import { RepositoryContextsPersister } from "~counselings/infrastructures/contexts/repository-contexts.persister";
import { RepositoryContextsReader } from "~counselings/infrastructures/contexts/repository-contexts.reader";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([ContextEntity])],
  providers: [
    ContextsService,
    {
      provide: ContextsRepository,
      useClass: PsqlContextsRepository,
    },
    {
      provide: ContextsReader,
      useClass: RepositoryContextsReader,
    },
    {
      provide: ContextsPersister,
      useClass: RepositoryContextsPersister,
    },
  ],
  exports: [ContextsService],
})
export class ContextsModule {}
