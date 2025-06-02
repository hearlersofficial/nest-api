import { PromptActivateHistoryRepository } from "~counselings/domains/promptActivateHistory/infrastructures/promptActivateHistory.repository";
import { PsqlPromptActivateHistoryRepository } from "~counselings/domains/promptActivateHistory/infrastructures/psql-promptActivateHistory.repository";
import { RepositoryPromptActivateHistoryPersister } from "~counselings/domains/promptActivateHistory/infrastructures/repository-promptActivateHistory.persister";
import { RepositoryPromptActivateHistoryReader } from "~counselings/domains/promptActivateHistory/infrastructures/repository-promptActivateHistory.reader";
import { PromptActivateHistoryPersister } from "~counselings/domains/promptActivateHistory/promptActivateHistory.persister";
import { PromptActivateHistoryReader } from "~counselings/domains/promptActivateHistory/promptActivateHistory.reader";
import { PromptActivateHistoryService } from "~counselings/domains/promptActivateHistory/promptActivateHistory.service";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PromptActivateHistoryEntity } from "~common/system/persistences/entities/prompts/PromptActivateHistory.entity";

@Module({
  imports: [TypeOrmModule.forFeature([PromptActivateHistoryEntity])],
  providers: [
    PromptActivateHistoryService,
    {
      provide: PromptActivateHistoryRepository,
      useClass: PsqlPromptActivateHistoryRepository,
    },
    {
      provide: PromptActivateHistoryPersister,
      useClass: RepositoryPromptActivateHistoryPersister,
    },
    {
      provide: PromptActivateHistoryReader,
      useClass: RepositoryPromptActivateHistoryReader,
    },
  ],
  exports: [PromptActivateHistoryService],
})
export class PromptActivateHistoryModule {}
