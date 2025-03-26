import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { InstructionsCriteriaFindMany } from "~counselings/domains/instructions/instructions.criteria";
import { Instructions } from "~counselings/domains/instructions/models/instructions";

import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class InstructionsReader {
  abstract findOne(props: { instructionId: UniqueEntityId }): Promise<Instructions | null>;
  abstract findMany(props: InstructionsCriteriaFindMany): Promise<Instructions[]>;
}
