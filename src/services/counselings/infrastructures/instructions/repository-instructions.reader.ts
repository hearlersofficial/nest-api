import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { InstructionsCriteriaFindMany } from "~counselings/domains/instructions/instructions.criteria";
import { InstructionsReader } from "~counselings/domains/instructions/instructions.reader";
import { Instructions } from "~counselings/domains/instructions/models/instructions";
import { InstructionsRepository } from "~counselings/infrastructures/instructions/instructions.repository";
import { RepositoryInstructionCriteriaMapper } from "~counselings/infrastructures/instructions/mappers/repository-instructions-criteria.mapper";

import { Injectable } from "@nestjs/common";

@Injectable()
export class RepositoryInstructionsReader extends InstructionsReader {
  constructor(private readonly instructionsRepository: InstructionsRepository) {
    super();
  }

  override async findOne(props: { instructionId: UniqueEntityId }): Promise<Instructions | null> {
    return this.instructionsRepository.findByInstructionId(props.instructionId);
  }

  override async findMany(props: InstructionsCriteriaFindMany): Promise<Instructions[]> {
    const typeormOptions = RepositoryInstructionCriteriaMapper.toFindManyOptions(props);
    return this.instructionsRepository.findMany(typeormOptions);
  }
}
