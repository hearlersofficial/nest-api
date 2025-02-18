import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { Instructions } from "~counselings/aggregates/instructions/domain/instructions";

export const INSTRUCTION_REPOSITORY = Symbol("INSTRUCTION_REPOSITORY");

export interface InstructionsRepositoryPort {
  findOne(props: FindOnePropsInInstructionsRepository): Promise<Instructions | null>;
}

export interface FindOnePropsInInstructionsRepository {
  instructionId?: UniqueEntityId;
}
