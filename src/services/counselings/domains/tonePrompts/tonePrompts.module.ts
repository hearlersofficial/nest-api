import { PsqlTonePromptsRepository } from "~counselings/domains/tonePrompts/infrastructures/psql-tonePrompts.repository";
import { RepositoryTonePromptsPersister } from "~counselings/domains/tonePrompts/infrastructures/repository-tonePrompts.persister";
import { RepositoryTonePromptsReader } from "~counselings/domains/tonePrompts/infrastructures/repository-tonePrompts.reader";
import { TonePromptsRepository } from "~counselings/domains/tonePrompts/infrastructures/tonePrompts.repository";
import { TonePromptsPersister } from "~counselings/domains/tonePrompts/tonePrompts.persister";
import { TonePromptsReader } from "~counselings/domains/tonePrompts/tonePrompts.reader";
import { TonePromptsService } from "~counselings/domains/tonePrompts/tonePrompts.service";

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
      provide: TonePromptsPersister,
      useClass: RepositoryTonePromptsPersister,
    },
  ],
  exports: [TonePromptsService],
})
export class TonePromptsModule {}
