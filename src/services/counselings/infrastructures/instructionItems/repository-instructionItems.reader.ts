import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { InstructionItemsCriteriaFindMany } from "~counselings/domains/instructionItems/instructionItems.criteria";
import { InstructionItemsReader } from "~counselings/domains/instructionItems/instructionItems.reader";
import { InstructionItems } from "~counselings/domains/instructionItems/models/instructionItems";
import { InstructionItemsRepository } from "~counselings/infrastructures/instructionItems/instructionItems.repository";
import { RepositoryInstructionItemCriteriaMapper } from "~counselings/infrastructures/instructionItems/mappers/repository-instructionItems-criteria.mapper";

import { Injectable } from "@nestjs/common";

@Injectable()
export class RepositoryInstructionItemsReader extends InstructionItemsReader {
  constructor(private readonly instructionItemsRepository: InstructionItemsRepository) {
    super();
  }

  override async findOne(props: { instructionItemId: UniqueEntityId }): Promise<InstructionItems | null> {
    return this.instructionItemsRepository.findByInstructionItemId(props.instructionItemId);
  }

  override async findMany(props: InstructionItemsCriteriaFindMany): Promise<InstructionItems[]> {
    const typeormOptions = RepositoryInstructionItemCriteriaMapper.toFindManyOptions(props);
    return this.instructionItemsRepository.findMany(typeormOptions);
  }
}
