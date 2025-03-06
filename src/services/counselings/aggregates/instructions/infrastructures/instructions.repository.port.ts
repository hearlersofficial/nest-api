import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { Instructions } from "~counselings/aggregates/instructions/domain/instructions";

export const INSTRUCTION_REPOSITORY = Symbol("INSTRUCTION_REPOSITORY");

export interface InstructionsRepositoryPort {
  create(instruction: Instructions): Promise<Instructions>;
  update(instruction: Instructions): Promise<Instructions>;
  findOne(instructionId: UniqueEntityId): Promise<Instructions | null>;
  findAll(): Promise<Instructions[]>;
  findMany(props: FindManyPropsInInstructionsRepository): Promise<Instructions[]>;
}

export interface FindManyPropsInInstructionsRepository {
  name?: string;
}
