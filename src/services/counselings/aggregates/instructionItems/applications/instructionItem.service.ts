import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { InstructionItemPersistor } from "~counselings/aggregates/instructionItems/applications/tools/instructionItem.persistor";
import { InstructionItemReader } from "~counselings/aggregates/instructionItems/applications/tools/instructionItem.reader";
import {
  InstructionItems,
  InstructionItemsNewProps,
} from "~counselings/aggregates/instructionItems/domain/instructionItems";

import { HttpStatus, Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class InstructionItemService {
  constructor(
    private readonly instructionItemReader: InstructionItemReader,
    private readonly instructionItemPersistor: InstructionItemPersistor,
  ) {}

  async create(instructionItemNewProps: InstructionItemsNewProps): Promise<InstructionItems> {
    const instructionItemOrError = InstructionItems.createNew(instructionItemNewProps);
    if (instructionItemOrError.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, instructionItemOrError.error as string);
    }
    const instructionItem = instructionItemOrError.value;
    const createdInstructionItem = await this.instructionItemPersistor.create(instructionItem);
    return createdInstructionItem;
  }

  async update(instructionItem: InstructionItems): Promise<InstructionItems> {
    const updatedInstructionItem = await this.instructionItemPersistor.update(instructionItem);
    return updatedInstructionItem;
  }

  async findOne(instructionItemId: UniqueEntityId): Promise<InstructionItems | null> {
    const instructionItem = await this.instructionItemReader.findOne(instructionItemId);
    return instructionItem;
  }

  async findAll(): Promise<InstructionItems[]> {
    const instructionItems = await this.instructionItemReader.findAll();
    return instructionItems;
  }

  async findMany(props: { keyword?: string; ids?: UniqueEntityId[] }): Promise<InstructionItems[]> {
    const instructionItems = await this.instructionItemReader.findMany(props);
    return instructionItems;
  }

  async getById(instructionItemId: UniqueEntityId): Promise<InstructionItems> {
    const instructionItem: InstructionItems | null = await this.findOne(instructionItemId);
    if (!instructionItem) {
      throw new NotFoundException("InstructionItem not found");
    }
    return instructionItem;
  }

  async getAll(): Promise<InstructionItems[]> {
    const instructionItems = await this.findAll();
    if (instructionItems.length === 0) {
      throw new NotFoundException("InstructionItems not found");
    }
    return instructionItems;
  }

  async getMany(props: { keyword?: string; ids?: UniqueEntityId[] }): Promise<InstructionItems[]> {
    const instructionItems = await this.findMany(props);
    if (instructionItems.length === 0) {
      throw new NotFoundException("InstructionItems not found");
    }
    return instructionItems;
  }
}
