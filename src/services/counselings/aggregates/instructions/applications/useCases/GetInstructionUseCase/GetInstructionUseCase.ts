import { UseCase } from "~shared/core/applications/UseCase";
import { GetInstructionUseCaseRequest } from "~counselings/aggregates/instructions/applications/useCases/GetInstructionUseCase/dto/GetInstruction.request";
import { GetInstructionUseCaseResponse } from "~counselings/aggregates/instructions/applications/useCases/GetInstructionUseCase/dto/GetInstruction.response";
import { INSTRUCTION_REPOSITORY, InstructionsRepositoryPort } from "~counselings/aggregates/instructions/infrastructures/instructions.repository.port";

import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class GetInstructionUseCase implements UseCase<GetInstructionUseCaseRequest, GetInstructionUseCaseResponse> {
  constructor(
    @Inject(INSTRUCTION_REPOSITORY)
    private readonly instructionRepository: InstructionsRepositoryPort,
  ) {}

  async execute(request: GetInstructionUseCaseRequest): Promise<GetInstructionUseCaseResponse> {
    const { instructionId } = request;
    const instruction = await this.instructionRepository.findOne({ instructionId });
    return {
      ok: true,
      instruction,
    };
  }
}
