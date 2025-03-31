import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { TonePrompts } from "~counselings/domains/tonePrompts/models/tonePrompts";
import { TonePromptsCriteriaFindMany } from "~counselings/domains/tonePrompts/tonePrompts.criteria";

import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class TonePromptsReader {
  abstract findOne(props: { tonePromptId: UniqueEntityId }): Promise<TonePrompts | null>;
  abstract findMany(props: TonePromptsCriteriaFindMany): Promise<TonePrompts[]>;
}
