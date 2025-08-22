import { PromptActivateHistoryRepository } from "~counselings/domains/prompt-activate-history/infrastructures/promptActivateHistory.repository";
import { RepositoryPromptActivateHistoryReader } from "~counselings/domains/prompt-activate-history/infrastructures/repository-prompt-activate-history.reader";
import { RepositoryPromptActivateHistoryStore } from "~counselings/domains/prompt-activate-history/infrastructures/repository-prompt-activate-history.store";
import { PsqlPromptActivateHistoryRepository } from "~counselings/domains/prompt-activate-history/infrastructures/typeorm-prompt-activate-history.repository";
import { PromptActivateHistoryReader } from "~counselings/domains/prompt-activate-history/prompt-activate-history.reader";
import { PromptActivateHistoryService } from "~counselings/domains/prompt-activate-history/prompt-activate-history.service";
import { PromptActivateHistoryStore } from "~counselings/domains/prompt-activate-history/prompt-activate-history.store";

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
      provide: PromptActivateHistoryStore,
      useClass: RepositoryPromptActivateHistoryStore,
    },
    {
      provide: PromptActivateHistoryReader,
      useClass: RepositoryPromptActivateHistoryReader,
    },
  ],
  exports: [PromptActivateHistoryService],
})
export class PromptActivateHistoryModule {}
