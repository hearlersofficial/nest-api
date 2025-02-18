import { InstructionItemEntity } from "~shared/core/infrastructure/entities/prompts/InstructionItems.entity";
import { InstructionItemsRepositoryPort } from "~counselings/aggregates/instructionItems/infrastructures/instructionItems.repository.port";

import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

export class PsqlInstructionItemsRepositoryAdaptor implements InstructionItemsRepositoryPort {
  constructor(
    @InjectRepository(InstructionItemEntity)
    private readonly instructionItemsRepository: Repository<InstructionItemEntity>,
  ) {}
}
