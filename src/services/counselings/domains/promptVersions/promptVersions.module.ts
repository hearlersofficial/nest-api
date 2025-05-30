import { PromptVersionsPersister } from "~counselings/domains/promptVersions/promptVersions.persister";
import { PromptVersionsReader } from "~counselings/domains/promptVersions/promptVersions.reader";
import { PromptVersionsService } from "~counselings/domains/promptVersions/promptVersions.service";
import { PromptVersionsRepository } from "~counselings/infrastructures/promptVersions/promptVersions.repository";
import { PsqlPromptVersionsRepository } from "~counselings/infrastructures/promptVersions/psql-promptVersions.repository";
import { RepositoryPromptVersionsPersister } from "~counselings/infrastructures/promptVersions/repository-promptVersions.persister";
import { RepositoryPromptVersionsReader } from "~counselings/infrastructures/promptVersions/repository-promptVersions.reader";

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
