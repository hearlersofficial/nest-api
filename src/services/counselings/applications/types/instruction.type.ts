import { InstructionItems } from "~counselings/domains/instructionItems/models/instructionItems";
import { Instructions } from "~counselings/domains/instructions/models/instructions";

export type InstructionWithItems = {
  instruction: Instructions;
  instructionItems: InstructionItems[];
};
