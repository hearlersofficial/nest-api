import { Instructions, InstructionsNewProps } from "~counselings/domains/instructions/models/instructions";

import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class InstructionsPersister {
  abstract create(newProps: InstructionsNewProps): Promise<Instructions>;
  abstract update(instruction: Instructions): Promise<Instructions>;
  abstract updateMany(instructions: Instructions[]): Promise<Instructions[]>;
}
