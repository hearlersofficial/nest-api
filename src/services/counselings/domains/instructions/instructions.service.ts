import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { InstructionsCriteriaFindMany } from "~counselings/domains/instructions/instructions.criteria";
import { InstructionsPersister } from "~counselings/domains/instructions/instructions.persister";
import { InstructionsReader } from "~counselings/domains/instructions/instructions.reader";
import { Instructions, InstructionsNewProps } from "~counselings/domains/instructions/models/instructions";

import { HttpStatus, Injectable } from "@nestjs/common";

@Injectable()
export class InstructionsService {
  constructor(private readonly instructionsReader: InstructionsReader, private readonly instructionsPersister: InstructionsPersister) {}

  async create(newProps: InstructionsNewProps): Promise<Instructions> {
    return this.instructionsPersister.create(newProps);
  }

  async update(instruction: Instructions): Promise<Instructions> {
    return this.instructionsPersister.update(instruction);
  }

  async findOne(props: { instructionId: UniqueEntityId }): Promise<Instructions | null> {
    return this.instructionsReader.findOne(props);
  }

  async getOne(props: { instructionId: UniqueEntityId }): Promise<Instructions> {
    const instruction = await this.findOne(props);
    if (!instruction) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Instruction not found");
    }
    return instruction;
  }

  async findMany(props: InstructionsCriteriaFindMany): Promise<Instructions[]> {
    return this.instructionsReader.findMany(props);
  }
}
