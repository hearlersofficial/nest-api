import { InstructionEntity } from "~shared/core/infrastructure/entities/prompts/Instructions.entity";
import { InstructionsRepositoryPort } from "~counselings/aggregates/instructions/infrastructures/instructions.repository.port";

import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

export class PsqlInstructionsRepositoryAdaptor implements InstructionsRepositoryPort {
  constructor(
    @InjectRepository(InstructionEntity)
    private readonly instructionsRepository: Repository<InstructionEntity>,
  ) {}
}
