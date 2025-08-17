import { PsqlTonePromptsRepository } from "~counselings/domains/tonePrompts/infrastructures/psql-tonePrompts.repository";
import { RepositoryTonePromptsReader } from "~counselings/domains/tonePrompts/infrastructures/repository-tonePrompts.reader";
import { RepositoryTonePromptsStore } from "~counselings/domains/tonePrompts/infrastructures/repository-tonePrompts.store";
import { TonePromptsRepository } from "~counselings/domains/tonePrompts/infrastructures/tonePrompts.repository";
import { TonePromptsReader } from "~counselings/domains/tonePrompts/tonePrompts.reader";
import { TonePromptsService } from "~counselings/domains/tonePrompts/tonePrompts.service";
import { TonePromptsStore } from "~counselings/domains/tonePrompts/tonePrompts.store";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TonePromptEntity } from "~common/system/persistences/entities/prompts/TonePrompts.entity";

@Module({
  imports: [TypeOrmModule.forFeature([TonePromptEntity])],
  providers: [
    TonePromptsService,
    {
      provide: TonePromptsRepository,
      useClass: PsqlTonePromptsRepository,
    },
    {
      provide: TonePromptsReader,
      useClass: RepositoryTonePromptsReader,
    },
    {
      provide: TonePromptsStore,
      useClass: RepositoryTonePromptsStore,
    },
  ],
  exports: [TonePromptsService],
})
export class TonePromptsModule {}
