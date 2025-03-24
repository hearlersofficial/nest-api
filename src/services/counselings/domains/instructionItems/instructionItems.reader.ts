import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { InstructionItemsCriteriaFindMany } from "~counselings/domains/instructionItems/instructionItems.criteria";
import { InstructionItems } from "~counselings/domains/instructionItems/models/instructionItems";

import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class InstructionItemsReader {
  abstract findOne(props: { instructionItemId: UniqueEntityId }): Promise<InstructionItems | null>;
  abstract findMany(props: InstructionItemsCriteriaFindMany): Promise<InstructionItems[]>;
}
