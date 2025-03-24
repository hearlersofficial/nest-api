import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { InstructionItemEntity } from "~shared/core/infrastructure/entities/prompts/InstructionItems.entity";
import { InstructionItems } from "~counselings/domains/instructionItems/models/instructionItems";
import { InstructionItemsRepository } from "~counselings/infrastructures/instructionItems/instructionItems.repository";
import { PsqlInstructionItemsMapper } from "~counselings/infrastructures/instructionItems/mappers/psql.instructionItems.mapper";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, FindOneOptions, Repository } from "typeorm";

@Injectable()
export class PsqlInstructionItemsRepository extends InstructionItemsRepository {
  constructor(
    @InjectRepository(InstructionItemEntity)
    private readonly instructionItemsRepository: Repository<InstructionItemEntity>,
  ) {
    super();
  }

  override async findByInstructionItemId(instructionItemId: UniqueEntityId, options?: FindOneOptions<InstructionItemEntity>): Promise<InstructionItems | null> {
    const findOneOptions: FindOneOptions<InstructionItemEntity> = options ?? {};
    findOneOptions.where = {
      ...findOneOptions.where,
      id: instructionItemId.getString(),
    };
    const instructionItem = await this.instructionItemsRepository.findOne(findOneOptions);
    return instructionItem ? PsqlInstructionItemsMapper.toDomain(instructionItem) : null;
  }

  override async findMany(options?: FindManyOptions<InstructionItemEntity>): Promise<InstructionItems[]> {
    const findManyOptions: FindManyOptions<InstructionItemEntity> = options ?? {};
    const instructionItems = await this.instructionItemsRepository.find(findManyOptions);
    return PsqlInstructionItemsMapper.toDomains(instructionItems);
  }

  override async save(instructionItem: InstructionItems): Promise<InstructionItems>;
  override async save(instructionItems: InstructionItems[]): Promise<InstructionItems[]>;
  async save(instructionItem: InstructionItems | InstructionItems[]): Promise<InstructionItems | InstructionItems[]> {
    if (Array.isArray(instructionItem)) {
      await this.instructionItemsRepository.save(PsqlInstructionItemsMapper.toEntities(instructionItem));
      return instructionItem;
    } else {
      const instructionItemEntity = PsqlInstructionItemsMapper.toEntity(instructionItem);
      await this.instructionItemsRepository.save(instructionItemEntity);
      return instructionItem;
    }
  }
}
