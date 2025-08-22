import { PromptVersionsRepository } from "~counselings/domains/prompt-versions/infrastructures/prompt-versions.repository";
import { RepositoryPromptVersionsReader } from "~counselings/domains/prompt-versions/infrastructures/repository-prompt-versions.reader";
import { RepositoryPromptVersionsStore } from "~counselings/domains/prompt-versions/infrastructures/repository-prompt-versions.store";
import { TypeormPromptVersionsRepository } from "~counselings/domains/prompt-versions/infrastructures/typeorm-prompt-versions.repository";
import { PromptVersionsReader } from "~counselings/domains/prompt-versions/prompt-versions.reader";
import { PromptVersionsService } from "~counselings/domains/prompt-versions/prompt-versions.service";
import { PromptVersionsStore } from "~counselings/domains/prompt-versions/prompt-versions.store";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PromptVersionEntity } from "~common/system/persistences/entities/prompts/PromptVersions.entity";

@Module({
  imports: [TypeOrmModule.forFeature([PromptVersionEntity])],
  providers: [
    PromptVersionsService,
    {
      provide: PromptVersionsRepository,
      useClass: TypeormPromptVersionsRepository,
    },
    {
      provide: PromptVersionsReader,
      useClass: RepositoryPromptVersionsReader,
    },
    {
      provide: PromptVersionsStore,
      useClass: RepositoryPromptVersionsStore,
    },
  ],
  exports: [PromptVersionsService],
})
export class PromptVersionsModule {}
