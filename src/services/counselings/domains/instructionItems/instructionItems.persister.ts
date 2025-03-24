import { InstructionItems, InstructionItemsNewProps } from "~counselings/domains/instructionItems/models/instructionItems";

import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class InstructionItemsPersister {
  abstract create(newProps: InstructionItemsNewProps): Promise<InstructionItems>;
  abstract update(context: InstructionItems): Promise<InstructionItems>;
  abstract updateMany(instructionItems: InstructionItems[]): Promise<InstructionItems[]>;
}
