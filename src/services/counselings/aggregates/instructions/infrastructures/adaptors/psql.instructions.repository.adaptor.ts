import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { InstructionMapEntity } from "~shared/core/infrastructure/entities/prompts/InstructionMaps.entity";
import { InstructionEntity } from "~shared/core/infrastructure/entities/prompts/Instructions.entity";
import { Instructions } from "~counselings/aggregates/instructions/domain/instructions";
import { PsqlInstructionsMapper } from "~counselings/aggregates/instructions/infrastructures/adaptors/mappers/psql.instructions.mapper";
import {
  FindManyPropsInInstructionsRepository,
  InstructionsRepositoryPort,
} from "~counselings/aggregates/instructions/infrastructures/instructions.repository.port";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsRelations, FindOptionsWhere, Repository } from "typeorm";

@Injectable()
export class PsqlInstructionsRepositoryAdaptor implements InstructionsRepositoryPort {
  private readonly instructionFindOptionsRelation: FindOptionsRelations<InstructionEntity> = {
    instructionMaps: true,
  };

  constructor(
    @InjectRepository(InstructionEntity)
    private readonly instructionsRepository: Repository<InstructionEntity>,
    @InjectRepository(InstructionMapEntity)
    private readonly instructionMapRepository: Repository<InstructionMapEntity>,
  ) {}

  async create(instruction: Instructions): Promise<Instructions> {
    const instructionEntity = PsqlInstructionsMapper.toEntity(instruction);
    await this.instructionsRepository.save(instructionEntity);
    return instruction;
  }

  async update(instruction: Instructions): Promise<Instructions> {
    const instructionEntity = PsqlInstructionsMapper.toEntity(instruction);
    for (const instructionMap of instructionEntity.instructionMaps) {
      await this.instructionMapRepository.save(instructionMap);
    }
    await this.instructionsRepository.save(instructionEntity);
    return instruction;
  }

  async findOne(instructionId: UniqueEntityId): Promise<Instructions | null> {
    const instructionEntity = await this.instructionsRepository.findOne({
      where: { id: instructionId.getString() },
      relations: this.instructionFindOptionsRelation,
    });
    if (!instructionEntity) {
      return null;
    }
    return PsqlInstructionsMapper.toDomain(instructionEntity);
  }

  async findAll(): Promise<Instructions[]> {
    const instructionEntities = await this.instructionsRepository.find({
      relations: this.instructionFindOptionsRelation,
    });
    return instructionEntities.map((instructionEntity) => PsqlInstructionsMapper.toDomain(instructionEntity)).filter((instruction) => instruction !== null);
  }

  async findMany(props: FindManyPropsInInstructionsRepository): Promise<Instructions[]> {
    const findOptionsWhere: FindOptionsWhere<InstructionEntity> = {};
    if (props.name) {
      findOptionsWhere.name = props.name;
    }
    const instructionEntities = await this.instructionsRepository.find({
      where: findOptionsWhere,
      relations: this.instructionFindOptionsRelation,
    });
    return instructionEntities.map((instructionEntity) => PsqlInstructionsMapper.toDomain(instructionEntity)).filter((instruction) => instruction !== null);
  }
}
