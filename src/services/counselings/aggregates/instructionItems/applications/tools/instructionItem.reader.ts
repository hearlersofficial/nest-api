import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { InstructionItems } from "~counselings/aggregates/instructionItems/domain/instructionItems";
import {
  INSTRUCTION_ITEM_REPOSITORY,
  InstructionItemsRepositoryPort,
} from "~counselings/aggregates/instructionItems/infrastructures/instructionItems.repository.port";

import { Inject, Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class InstructionItemReader {
  constructor(
    @Inject(INSTRUCTION_ITEM_REPOSITORY)
    private readonly instructionItemRepository: InstructionItemsRepositoryPort,
  ) {}

  async findOne(instructionItemId: UniqueEntityId): Promise<InstructionItems | null> {
    const instructionItem = await this.instructionItemRepository.findOne(instructionItemId);
    return instructionItem;
  }

  async findAll(): Promise<InstructionItems[]> {
    const instructionItems = await this.instructionItemRepository.findAll();
    return instructionItems;
  }

  async findMany(props: { keyword?: string; ids?: UniqueEntityId[] }): Promise<InstructionItems[]> {
    const instructionItems = await this.instructionItemRepository.findMany(props);
    // id들의 길이 및 순서 보장
    if (props.ids) {
      if (props.ids.length !== instructionItems.length) {
        throw new NotFoundException("InstructionItem not found with the provided ids");
      }
      const instructionItemMap = new Map(instructionItems.map((item) => [item.id.getString(), item]));
      return props.ids
        .map((id) => instructionItemMap.get(id.getString()))
        .filter((instructionItem) => instructionItem !== undefined);
    }
    return instructionItems;
  }
}
