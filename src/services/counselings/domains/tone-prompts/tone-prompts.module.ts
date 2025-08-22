import { RepositoryTonePromptsReader } from "~counselings/domains/tone-prompts/infrastructures/repository-tone-prompts.reader";
import { RepositoryTonePromptsStore } from "~counselings/domains/tone-prompts/infrastructures/repository-tone-prompts.store";
import { TonePromptsRepository } from "~counselings/domains/tone-prompts/infrastructures/tone-prompts.repository";
import { TypeormTonePromptsRepository } from "~counselings/domains/tone-prompts/infrastructures/typeorm-tone-prompts.repository";
import { TonePromptsReader } from "~counselings/domains/tone-prompts/tone-prompts.reader";
import { TonePromptsService } from "~counselings/domains/tone-prompts/tone-prompts.service";
import { TonePromptsStore } from "~counselings/domains/tone-prompts/tone-prompts.store";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TonePromptEntity } from "~common/system/persistences/entities/prompts/TonePrompts.entity";

@Module({
  imports: [TypeOrmModule.forFeature([TonePromptEntity])],
  providers: [
    TonePromptsService,
    {
      provide: TonePromptsRepository,
      useClass: TypeormTonePromptsRepository,
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
