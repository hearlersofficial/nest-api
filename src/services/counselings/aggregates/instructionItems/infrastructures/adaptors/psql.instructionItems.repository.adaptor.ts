import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { InstructionItemEntity } from "~shared/core/infrastructure/entities/prompts/InstructionItems.entity";
import { InstructionItems } from "~counselings/aggregates/instructionItems/domain/instructionItems";
import { PsqlInstructionItemsMapper } from "~counselings/aggregates/instructionItems/infrastructures/adaptors/mappers/psql.instructionItems.mapper";
import {
  FindManyPropsInInstructionItemsRepository,
  InstructionItemsRepositoryPort,
} from "~counselings/aggregates/instructionItems/infrastructures/instructionItems.repository.port";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, ILike, In, Repository } from "typeorm";

@Injectable()
export class PsqlInstructionItemsRepositoryAdaptor implements InstructionItemsRepositoryPort {
  constructor(
    @InjectRepository(InstructionItemEntity)
    private readonly instructionItemsRepository: Repository<InstructionItemEntity>,
  ) {}

  async create(instructionItem: InstructionItems): Promise<InstructionItems> {
    const instructionItemEntity = PsqlInstructionItemsMapper.toEntity(instructionItem);
    await this.instructionItemsRepository.save(instructionItemEntity);
    return instructionItem;
  }

  async update(instructionItem: InstructionItems): Promise<InstructionItems> {
    const instructionItemEntity = PsqlInstructionItemsMapper.toEntity(instructionItem);
    await this.instructionItemsRepository.update(instructionItemEntity.id, instructionItemEntity);
    return instructionItem;
  }

  async findOne(instructionItemId: UniqueEntityId): Promise<InstructionItems | null> {
    const instructionItemEntity = await this.instructionItemsRepository.findOne({
      where: { id: instructionItemId.getString() },
    });
    if (!instructionItemEntity) {
      return null;
    }
    return PsqlInstructionItemsMapper.toDomain(instructionItemEntity);
  }

  async findAll(): Promise<InstructionItems[]> {
    const instructionItemEntities = await this.instructionItemsRepository.find();
    return instructionItemEntities
      .map((instructionItemEntity) => PsqlInstructionItemsMapper.toDomain(instructionItemEntity))
      .filter((instructionItem) => instructionItem !== null);
  }

  async findMany(props: FindManyPropsInInstructionItemsRepository): Promise<InstructionItems[]> {
    const findOptionsWhere: FindOptionsWhere<InstructionItemEntity> = {};
    if (props.keyword) {
      findOptionsWhere.body = ILike(`%${props.keyword}%`);
    }
    if (props.ids) {
      findOptionsWhere.id = In(props.ids.map((id) => id.getString()));
    }
    const instructionItemEntities = await this.instructionItemsRepository.find({
      where: findOptionsWhere,
    });
    return instructionItemEntities
      .map((instructionItemEntity) => PsqlInstructionItemsMapper.toDomain(instructionItemEntity))
      .filter((instructionItem) => instructionItem !== null);
  }
}
