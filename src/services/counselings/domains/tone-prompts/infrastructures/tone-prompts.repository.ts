import { TonePrompts } from "~counselings/domains/tone-prompts/models/tone-prompts";

import { Injectable } from "@nestjs/common";
import { TonePromptId } from "~common/shared-kernel/identifiers/tone-prompt.id";
import { TonePromptEntity } from "~common/system/persistences/entities/prompts/tone-prompts.entity";
import { FindManyOptions, FindOneOptions } from "typeorm";

@Injectable()
export abstract class TonePromptsRepository {
  abstract findByTonePromptId(
    tonePromptId: TonePromptId,
    options?: FindOneOptions<TonePromptEntity>,
  ): Promise<TonePrompts | null>;
  abstract findMany(options?: FindManyOptions<TonePromptEntity>): Promise<TonePrompts[]>;
  abstract save(tonePrompt: TonePrompts): Promise<TonePrompts>;
  abstract save(tonePrompts: TonePrompts[]): Promise<TonePrompts[]>;
}
