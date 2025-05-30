import { TonePrompts } from "~counselings/domains/tonePrompts/models/tonePrompts";

import { Injectable } from "@nestjs/common";
import { UniqueEntityId } from "~common/shared-kernel/domains/UniqueEntityId";
import { TonePromptEntity } from "~common/system/persistences/entities/prompts/TonePrompts.entity";
import { FindManyOptions, FindOneOptions } from "typeorm";

@Injectable()
export abstract class TonePromptsRepository {
  abstract findByTonePromptId(
    tonePromptId: UniqueEntityId,
    options?: FindOneOptions<TonePromptEntity>,
  ): Promise<TonePrompts | null>;
  abstract findMany(options?: FindManyOptions<TonePromptEntity>): Promise<TonePrompts[]>;
  abstract save(tonePrompt: TonePrompts): Promise<TonePrompts>;
  abstract save(tonePrompts: TonePrompts[]): Promise<TonePrompts[]>;
}
