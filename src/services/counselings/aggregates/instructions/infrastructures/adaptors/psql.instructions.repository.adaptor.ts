import { InstructionEntity } from "~shared/core/infrastructure/entities/prompts/Instructions.entity";
import { Instructions } from "~counselings/aggregates/instructions/domain/instructions";
import { PsqlInstructionsMapper } from "~counselings/aggregates/instructions/infrastructures/adaptors/mappers/psql.instructions.mapper";
import {
  FindOnePropsInInstructionsRepository,
  InstructionsRepositoryPort,
} from "~counselings/aggregates/instructions/infrastructures/instructions.repository.port";

import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";

export class PsqlInstructionsRepositoryAdaptor implements InstructionsRepositoryPort {
  constructor(
    @InjectRepository(InstructionEntity)
    private readonly instructionsRepository: Repository<InstructionEntity>,
  ) {}

  async findOne(props: FindOnePropsInInstructionsRepository): Promise<Instructions | null> {
    const { instructionId } = props;
    const findOptionsWhere: FindOptionsWhere<InstructionEntity> = {};

    if (instructionId !== null && instructionId !== undefined) {
      findOptionsWhere.id = instructionId.getString();
    }

    const instructionEntity = await this.instructionsRepository.findOne({
      where: findOptionsWhere,
      relations: {
        instructionMaps: true,
      },
    });

    return instructionEntity ? PsqlInstructionsMapper.toDomain(instructionEntity) : null;
  }
}
