import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { InstructionItemsPersister } from "~counselings/domains/instructionItems/instructionItems.persister";
import { InstructionItems, InstructionItemsNewProps } from "~counselings/domains/instructionItems/models/instructionItems";
import { InstructionItemsRepository } from "~counselings/infrastructures/instructionItems/instructionItems.repository";

import { HttpStatus, Injectable } from "@nestjs/common";

@Injectable()
export class RepositoryInstructionItemsPersister extends InstructionItemsPersister {
  constructor(private readonly instructionItemsRepository: InstructionItemsRepository) {
    super();
  }

  override async create(newProps: InstructionItemsNewProps): Promise<InstructionItems> {
    const instructionItemResult = InstructionItems.createNew(newProps);
    if (instructionItemResult.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, instructionItemResult.error as string);
    }
    return this.instructionItemsRepository.save(instructionItemResult.value);
  }

  override async update(instructionItem: InstructionItems): Promise<InstructionItems> {
    return this.instructionItemsRepository.save(instructionItem);
  }

  override async updateMany(instructionItems: InstructionItems[]): Promise<InstructionItems[]> {
    return this.instructionItemsRepository.save(instructionItems);
  }
}
