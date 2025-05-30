import { TonePrompts } from "~counselings/domains/tonePrompts/models/tonePrompts";
import { TonePromptsCriteriaFindMany } from "~counselings/domains/tonePrompts/tonePrompts.criteria";

import { Injectable } from "@nestjs/common";
import { UniqueEntityId } from "~common/shared-kernel/domains/UniqueEntityId";

@Injectable()
export abstract class TonePromptsReader {
  abstract findOne(props: { tonePromptId: UniqueEntityId }): Promise<TonePrompts | null>;
  abstract findMany(props: TonePromptsCriteriaFindMany): Promise<TonePrompts[]>;
}
