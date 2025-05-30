import { PromptActivateHistoryPersister } from "~counselings/domains/promptActivateHistory/promptActivateHistory.persister";
import { PromptActivateHistoryReader } from "~counselings/domains/promptActivateHistory/promptActivateHistory.reader";
import { PromptActivateHistoryService } from "~counselings/domains/promptActivateHistory/promptActivateHistory.service";
import { PromptActivateHistoryRepository } from "~counselings/infrastructures/promptActivateHistory/promptActivateHistory.repository";
import { PsqlPromptActivateHistoryRepository } from "~counselings/infrastructures/promptActivateHistory/psql-promptActivateHistory.repository";
import { RepositoryPromptActivateHistoryPersister } from "~counselings/infrastructures/promptActivateHistory/repository-promptActivateHistory.persister";
import { RepositoryPromptActivateHistoryReader } from "~counselings/infrastructures/promptActivateHistory/repository-promptActivateHistory.reader";

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
