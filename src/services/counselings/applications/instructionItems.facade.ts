import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { InstructionItemsService } from "~counselings/domains/instructionItems/instructionItems.service";

import { Injectable } from "@nestjs/common";

@Injectable()
export class InstructionItemsFacade {
  constructor(private readonly instructionItemsService: InstructionItemsService) {}

  async createInstructionItem(params: { body: string }) {
    const { body } = params;
    return this.instructionItemsService.create({ body });
  }

  async findInstructionItems(params: { keyword?: string }) {
    const { keyword } = params;
    return this.instructionItemsService.findMany({ keyword });
  }

  async findInstructionItemById(params: { instructionItemId: UniqueEntityId }) {
    const { instructionItemId } = params;
    return this.instructionItemsService.getOne({ instructionItemId });
  }

  async updateInstructionItem(params: { instructionItemId: UniqueEntityId; body?: string }) {
    const { instructionItemId, body } = params;
    const instructionItem = await this.instructionItemsService.getOne({ instructionItemId });

    instructionItem.update({ body });
    return this.instructionItemsService.update(instructionItem);
  }
}
