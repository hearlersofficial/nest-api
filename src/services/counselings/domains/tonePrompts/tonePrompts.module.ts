import { TonePromptEntity } from "~shared/core/infrastructure/entities/prompts/TonePrompts.entity";
import { TonePromptsPersister } from "~counselings/domains/tonePrompts/tonePrompts.persister";
import { TonePromptsReader } from "~counselings/domains/tonePrompts/tonePrompts.reader";
import { TonePromptsService } from "~counselings/domains/tonePrompts/tonePrompts.service";
import { PsqlTonePromptsRepository } from "~counselings/infrastructures/tonePrompts/psql-tonePrompts.repository";
import { RepositoryTonePromptsPersister } from "~counselings/infrastructures/tonePrompts/repository-tonePrompts.persister";
import { RepositoryTonePromptsReader } from "~counselings/infrastructures/tonePrompts/repository-tonePrompts.reader";
import { TonePromptsRepository } from "~counselings/infrastructures/tonePrompts/tonePrompts.repository";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

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
      provide: TonePromptsPersister,
      useClass: RepositoryTonePromptsPersister,
    },
  ],
  exports: [TonePromptsService],
})
export class TonePromptsModule {}
