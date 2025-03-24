import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { InstructionItemsCriteriaFindMany } from "~counselings/domains/instructionItems/instructionItems.criteria";
import { InstructionItemsPersister } from "~counselings/domains/instructionItems/instructionItems.persister";
import { InstructionItemsReader } from "~counselings/domains/instructionItems/instructionItems.reader";
import { InstructionItems, InstructionItemsNewProps } from "~counselings/domains/instructionItems/models/instructionItems";

import { HttpStatus, Injectable } from "@nestjs/common";

@Injectable()
export class InstructionItemsService {
  constructor(private readonly instructionItemsReader: InstructionItemsReader, private readonly instructionItemsPersister: InstructionItemsPersister) {}

  async create(newProps: InstructionItemsNewProps): Promise<InstructionItems> {
    return this.instructionItemsPersister.create(newProps);
  }

  async update(instructionItem: InstructionItems): Promise<InstructionItems> {
    return this.instructionItemsPersister.update(instructionItem);
  }

  async findOne(props: { instructionItemId: UniqueEntityId }): Promise<InstructionItems | null> {
    return this.instructionItemsReader.findOne(props);
  }

  async getOne(props: { instructionItemId: UniqueEntityId }): Promise<InstructionItems> {
    const instructionItem = await this.findOne(props);
    if (!instructionItem) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Instruction item not found");
    }
    return instructionItem;
  }

  async findMany(props: InstructionItemsCriteriaFindMany): Promise<InstructionItems[]> {
    return this.instructionItemsReader.findMany(props);
  }
}
