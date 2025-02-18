import { InstructionItemEntity } from "~shared/core/infrastructure/entities/prompts/InstructionItems.entity";
import { InstructionItems } from "~counselings/aggregates/instructionItems/domain/instructionItems";
import { PsqlInstructionItemsMapper } from "~counselings/aggregates/instructionItems/infrastructures/adaptors/mappers/psql.instructionItems.mapper";
import {
  FindManyPropsInInstructionItemsRepository,
  InstructionItemsRepositoryPort,
} from "~counselings/aggregates/instructionItems/infrastructures/instructionItems.repository.port";

import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, FindOptionsWhere, In, Repository } from "typeorm";

export class PsqlInstructionItemsRepositoryAdaptor implements InstructionItemsRepositoryPort {
  constructor(
    @InjectRepository(InstructionItemEntity)
    private readonly instructionItemsRepository: Repository<InstructionItemEntity>,
  ) {}

  async findMany(props: FindManyPropsInInstructionItemsRepository): Promise<InstructionItems[] | null> {
    const { instructionItemIds } = props;
    const findOptionsWhere: FindOptionsWhere<InstructionItemEntity> = {};
    if (instructionItemIds !== null && instructionItemIds !== undefined) {
      findOptionsWhere.id = In(instructionItemIds.map((id) => id.getString()));
    }

    const findManyOptions: FindManyOptions<InstructionItemEntity> = {
      where: findOptionsWhere,
    };

    const instructionItemsEntities = await this.instructionItemsRepository.find(findManyOptions);
    const instructionItemList = instructionItemsEntities.map((entity) => PsqlInstructionItemsMapper.toDomain(entity));
    return instructionItemList;
  }
}
