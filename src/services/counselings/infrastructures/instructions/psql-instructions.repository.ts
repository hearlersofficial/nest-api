import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { InstructionEntity } from "~shared/core/infrastructure/entities/prompts/Instructions.entity";
import { Instructions } from "~counselings/domains/instructions/models/instructions";
import { InstructionsRepository } from "~counselings/infrastructures/instructions/instructions.repository";
import { PsqlInstructionsMapper } from "~counselings/infrastructures/instructions/mappers/psql.instructions.mapper";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, FindOneOptions, FindOptionsRelations, Repository } from "typeorm";

@Injectable()
export class PsqlInstructionsRepository extends InstructionsRepository {
  private readonly instructionFindOptionsRelation: FindOptionsRelations<InstructionEntity> = {
    instructionMaps: true,
  };

  constructor(
    @InjectRepository(InstructionEntity)
    private readonly instructionsRepository: Repository<InstructionEntity>,
  ) {
    super();
  }

  override async findByInstructionId(instructionId: UniqueEntityId, options?: FindOneOptions<InstructionEntity>): Promise<Instructions | null> {
    const findOneOptions: FindOneOptions<InstructionEntity> = options ?? {};
    findOneOptions.where = {
      ...findOneOptions.where,
      id: instructionId.getString(),
    };
    findOneOptions.relations = { ...findOneOptions.relations, ...this.instructionFindOptionsRelation };
    const instruction = await this.instructionsRepository.findOne(findOneOptions);
    return instruction ? PsqlInstructionsMapper.toDomain(instruction) : null;
  }

  override async findMany(options?: FindManyOptions<InstructionEntity>): Promise<Instructions[]> {
    const findManyOptions: FindManyOptions<InstructionEntity> = options ?? {};
    findManyOptions.relations = { ...findManyOptions.relations, ...this.instructionFindOptionsRelation };
    const instructions = await this.instructionsRepository.find(findManyOptions);
    return PsqlInstructionsMapper.toDomains(instructions);
  }

  override async save(instruction: Instructions): Promise<Instructions>;
  override async save(instructions: Instructions[]): Promise<Instructions[]>;
  async save(instruction: Instructions | Instructions[]): Promise<Instructions | Instructions[]> {
    if (Array.isArray(instruction)) {
      await this.instructionsRepository.save(PsqlInstructionsMapper.toEntities(instruction));
      return instruction;
    } else {
      const instructionEntity = PsqlInstructionsMapper.toEntity(instruction);
      await this.instructionsRepository.save(instructionEntity);
      return instruction;
    }
  }
}
