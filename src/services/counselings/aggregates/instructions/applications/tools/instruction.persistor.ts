import { Instructions } from "~counselings/aggregates/instructions/domain/instructions";
import { INSTRUCTION_REPOSITORY, InstructionsRepositoryPort } from "~counselings/aggregates/instructions/infrastructures/instructions.repository.port";

import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class InstructionPersistor {
  constructor(
    @Inject(INSTRUCTION_REPOSITORY)
    private readonly instructionRepository: InstructionsRepositoryPort,
  ) {}

  async create(instruction: Instructions): Promise<Instructions> {
    const createdInstruction = await this.instructionRepository.create(instruction);
    return createdInstruction;
  }

  async update(instruction: Instructions): Promise<Instructions> {
    const updatedInstruction = await this.instructionRepository.update(instruction);
    return updatedInstruction;
  }
}
