import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { InstructionEntity } from "~shared/core/infrastructure/entities/prompts/Instructions.entity";
import { Instructions } from "~counselings/aggregates/instructions/domain/instructions";
import { PsqlInstructionsMapper } from "~counselings/aggregates/instructions/infrastructures/adaptors/mappers/psql.instructions.mapper";
import {
  FindManyPropsInInstructionsRepository,
  InstructionsRepositoryPort,
} from "~counselings/aggregates/instructions/infrastructures/instructions.repository.port";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";

@Injectable()
export class PsqlInstructionsRepositoryAdaptor implements InstructionsRepositoryPort {
  constructor(
    @InjectRepository(InstructionEntity)
    private readonly instructionsRepository: Repository<InstructionEntity>,
  ) {}

  async create(instruction: Instructions): Promise<Instructions> {
    const instructionEntity = PsqlInstructionsMapper.toEntity(instruction);
    await this.instructionsRepository.save(instructionEntity);
    return instruction;
  }

  async update(instruction: Instructions): Promise<Instructions> {
    const instructionEntity = PsqlInstructionsMapper.toEntity(instruction);
    await this.instructionsRepository.update(instructionEntity.id, instructionEntity);
    return instruction;
  }

  async findOne(instructionId: UniqueEntityId): Promise<Instructions> {
    const instructionEntity = await this.instructionsRepository.findOne({
      where: { id: instructionId.getString() },
    });
    return PsqlInstructionsMapper.toDomain(instructionEntity);
  }

  async findAll(): Promise<Instructions[]> {
    const instructionEntities = await this.instructionsRepository.find();
    return instructionEntities.map((instructionEntity) => PsqlInstructionsMapper.toDomain(instructionEntity));
  }

  async findMany(props: FindManyPropsInInstructionsRepository): Promise<Instructions[]> {
    const findOptionsWhere: FindOptionsWhere<InstructionEntity> = {};
    if (props.name) {
      findOptionsWhere.name = props.name;
    }
    const instructionEntities = await this.instructionsRepository.find({
      where: findOptionsWhere,
    });
    return instructionEntities.map((instructionEntity) => PsqlInstructionsMapper.toDomain(instructionEntity));
  }
}
