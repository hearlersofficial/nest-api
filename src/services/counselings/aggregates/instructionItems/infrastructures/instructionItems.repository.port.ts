import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { InstructionItems } from "~counselings/aggregates/instructionItems/domain/instructionItems";

export const INSTRUCTION_ITEM_REPOSITORY = Symbol("INSTRUCTION_ITEM_REPOSITORY");

export interface InstructionItemsRepositoryPort {
  findMany(props: FindManyPropsInInstructionItemsRepository): Promise<InstructionItems[] | null>;
}

export interface FindManyPropsInInstructionItemsRepository {
  instructionItemIds?: UniqueEntityId[];
}
