import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { Instructions } from "~counselings/aggregates/instructions/domain/instructions";
import { INSTRUCTION_REPOSITORY, InstructionsRepositoryPort } from "~counselings/aggregates/instructions/infrastructures/instructions.repository.port";

import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class InstructionReader {
  constructor(
    @Inject(INSTRUCTION_REPOSITORY)
    private readonly instructionRepository: InstructionsRepositoryPort,
  ) {}

  async findOne(instructionId: UniqueEntityId): Promise<Instructions> {
    const instruction = await this.instructionRepository.findOne(instructionId);
    return instruction;
  }

  async findAll(): Promise<Instructions[]> {
    const instructions = await this.instructionRepository.findAll();
    return instructions;
  }

  async findMany(props: { name?: string }): Promise<Instructions[]> {
    const instructions = await this.instructionRepository.findMany(props);
    return instructions;
  }
}
