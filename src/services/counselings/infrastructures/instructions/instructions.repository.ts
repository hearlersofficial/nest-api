import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { InstructionEntity } from "~shared/core/infrastructure/entities/prompts/Instructions.entity";
import { Instructions } from "~counselings/domains/instructions/models/instructions";

import { Injectable } from "@nestjs/common";
import { FindManyOptions, FindOneOptions } from "typeorm";

@Injectable()
export abstract class InstructionsRepository {
  abstract findByInstructionId(instructionId: UniqueEntityId, options?: FindOneOptions<InstructionEntity>): Promise<Instructions | null>;
  abstract findMany(options?: FindManyOptions<InstructionEntity>): Promise<Instructions[]>;
  abstract save(instruction: Instructions): Promise<Instructions>;
  abstract save(instructions: Instructions[]): Promise<Instructions[]>;
}
