import { InstructionItems } from "~counselings/aggregates/instructionItems/domain/instructionItems";
import {
  INSTRUCTION_ITEM_REPOSITORY,
  InstructionItemsRepositoryPort,
} from "~counselings/aggregates/instructionItems/infrastructures/instructionItems.repository.port";

import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class InstructionItemPersistor {
  constructor(
    @Inject(INSTRUCTION_ITEM_REPOSITORY)
    private readonly instructionItemRepository: InstructionItemsRepositoryPort,
  ) {}

  async create(instructionItem: InstructionItems): Promise<InstructionItems> {
    const createdInstructionItem = await this.instructionItemRepository.create(instructionItem);
    return createdInstructionItem;
  }

  async update(instructionItem: InstructionItems): Promise<InstructionItems> {
    const updatedInstructionItem = await this.instructionItemRepository.update(instructionItem);
    return updatedInstructionItem;
  }
}
