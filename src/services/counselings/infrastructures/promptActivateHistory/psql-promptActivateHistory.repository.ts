import { PromptActivateHistories } from "~counselings/domains/promptActivateHistory/models/promptActivateHistory";
import { PsqlPromptActivateHistoryMapper } from "~counselings/infrastructures/promptActivateHistory/mappers/psql.promptActivateHistory.mapper";
import { PromptActivateHistoryRepository } from "~counselings/infrastructures/promptActivateHistory/promptActivateHistory.repository";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";
import { PromptActivateHistoryEntity } from "~common/system/persistences/entities/prompts/PromptActivateHistory.entity";
import { FindOneOptions, Repository } from "typeorm";

@Injectable()
export class PsqlPromptActivateHistoryRepository extends PromptActivateHistoryRepository {
  constructor(
    @InjectRepository(PromptActivateHistoryEntity)
    private readonly promptActivateHistoryRepository: Repository<PromptActivateHistoryEntity>,
  ) {
    super();
  }

  override async findByPromptActivateHistoryId(
    promptActivateHistoryId: UniqueEntityId,
    options?: FindOneOptions<PromptActivateHistoryEntity>,
  ): Promise<PromptActivateHistories | null> {
    const findOneOptions: FindOneOptions<PromptActivateHistoryEntity> = options ?? {};
    findOneOptions.where = {
      ...findOneOptions.where,
      id: promptActivateHistoryId.getString(),
    };
    const promptActivateHistory = await this.promptActivateHistoryRepository.findOne(findOneOptions);
    return promptActivateHistory ? PsqlPromptActivateHistoryMapper.toDomain(promptActivateHistory) : null;
  }

  override async findMany(options?: FindOneOptions<PromptActivateHistoryEntity>): Promise<PromptActivateHistories[]> {
    const findManyOptions: FindOneOptions<PromptActivateHistoryEntity> = options ?? {};
    const promptActivateHistory = await this.promptActivateHistoryRepository.find(findManyOptions);
    return PsqlPromptActivateHistoryMapper.toDomains(promptActivateHistory);
  }

  override async save(promptActivateHistory: PromptActivateHistories): Promise<PromptActivateHistories>;
  override async save(promptActivateHistory: PromptActivateHistories[]): Promise<PromptActivateHistories[]>;
  override async save(
    promptActivateHistory: PromptActivateHistories | PromptActivateHistories[],
  ): Promise<PromptActivateHistories | PromptActivateHistories[]> {
    if (Array.isArray(promptActivateHistory)) {
      await this.promptActivateHistoryRepository.save(
        PsqlPromptActivateHistoryMapper.toEntities(promptActivateHistory),
      );
      return promptActivateHistory;
    } else {
      const promptActivateHistoryEntity = PsqlPromptActivateHistoryMapper.toEntity(promptActivateHistory);
      await this.promptActivateHistoryRepository.save(promptActivateHistoryEntity);
      return promptActivateHistory;
    }
  }
}
