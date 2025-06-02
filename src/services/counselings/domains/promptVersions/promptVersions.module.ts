import { PromptVersionsRepository } from "~counselings/domains/promptVersions/infrastructures/promptVersions.repository";
import { PsqlPromptVersionsRepository } from "~counselings/domains/promptVersions/infrastructures/psql-promptVersions.repository";
import { RepositoryPromptVersionsPersister } from "~counselings/domains/promptVersions/infrastructures/repository-promptVersions.persister";
import { RepositoryPromptVersionsReader } from "~counselings/domains/promptVersions/infrastructures/repository-promptVersions.reader";
import { PromptVersionsPersister } from "~counselings/domains/promptVersions/promptVersions.persister";
import { PromptVersionsReader } from "~counselings/domains/promptVersions/promptVersions.reader";
import { PromptVersionsService } from "~counselings/domains/promptVersions/promptVersions.service";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PromptVersionEntity } from "~common/system/persistences/entities/prompts/PromptVersions.entity";

@Module({
  imports: [TypeOrmModule.forFeature([PromptVersionEntity])],
  providers: [
    PromptVersionsService,
    {
      provide: PromptVersionsRepository,
      useClass: PsqlPromptVersionsRepository,
    },
    {
      provide: PromptVersionsReader,
      useClass: RepositoryPromptVersionsReader,
    },
    {
      provide: PromptVersionsPersister,
      useClass: RepositoryPromptVersionsPersister,
    },
  ],
  exports: [PromptVersionsService],
})
export class PromptVersionsModule {}
