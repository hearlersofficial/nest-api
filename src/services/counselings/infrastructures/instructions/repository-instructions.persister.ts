import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { InstructionsPersister } from "~counselings/domains/instructions/instructions.persister";
import { Instructions, InstructionsNewProps } from "~counselings/domains/instructions/models/instructions";
import { InstructionsRepository } from "~counselings/infrastructures/instructions/instructions.repository";

import { HttpStatus, Injectable } from "@nestjs/common";

@Injectable()
export class RepositoryInstructionsPersister extends InstructionsPersister {
  constructor(private readonly instructionsRepository: InstructionsRepository) {
    super();
  }

  override async create(newProps: InstructionsNewProps): Promise<Instructions> {
    const instructionResult = Instructions.createNew(newProps);
    if (instructionResult.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, instructionResult.error as string);
    }
    return this.instructionsRepository.save(instructionResult.value);
  }

  override async update(instruction: Instructions): Promise<Instructions> {
    return this.instructionsRepository.save(instruction);
  }

  override async updateMany(instructions: Instructions[]): Promise<Instructions[]> {
    return this.instructionsRepository.save(instructions);
  }
}
