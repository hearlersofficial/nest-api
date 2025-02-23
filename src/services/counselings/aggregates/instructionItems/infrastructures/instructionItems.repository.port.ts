import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { InstructionItems } from "~counselings/aggregates/instructionItems/domain/instructionItems";

export const INSTRUCTION_ITEM_REPOSITORY = Symbol("INSTRUCTION_ITEM_REPOSITORY");

export interface InstructionItemsRepositoryPort {
  create(instructionItem: InstructionItems): Promise<InstructionItems>;
  update(instructionItem: InstructionItems): Promise<InstructionItems>;
  findOne(instructionItemId: UniqueEntityId): Promise<InstructionItems>;
  findAll(): Promise<InstructionItems[]>;
  findMany(props: FindManyPropsInInstructionItemsRepository): Promise<InstructionItems[]>;
}

export interface FindManyPropsInInstructionItemsRepository {
  keyword?: string;
  ids?: UniqueEntityId[];
}
