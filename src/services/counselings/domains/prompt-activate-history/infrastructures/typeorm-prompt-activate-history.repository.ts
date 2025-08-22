import { TypeormPromptActivateHistoryMapper } from "~counselings/domains/prompt-activate-history/infrastructures/mappers/typeorm-prompt-activate-history.mapper";
import { PromptActivateHistoryRepository } from "~counselings/domains/prompt-activate-history/infrastructures/promptActivateHistory.repository";
import { PromptActivateHistories } from "~counselings/domains/prompt-activate-history/models/prompt-activate-history";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PromptActivateHistoryId } from "~common/shared-kernel/identifiers/prompt-activate-history.id";
import { PromptActivateHistoryEntity } from "~common/system/persistences/entities/prompts/prompt-activate-history.entity";
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
    promptActivateHistoryId: PromptActivateHistoryId,
    options?: FindOneOptions<PromptActivateHistoryEntity>,
  ): Promise<PromptActivateHistories | null> {
    const findOneOptions: FindOneOptions<PromptActivateHistoryEntity> = options ?? {};
    findOneOptions.where = {
      ...findOneOptions.where,
      id: promptActivateHistoryId.getString(),
    };
    const promptActivateHistory = await this.promptActivateHistoryRepository.findOne(findOneOptions);
    return promptActivateHistory ? TypeormPromptActivateHistoryMapper.toDomain(promptActivateHistory) : null;
  }

  override async findMany(options?: FindOneOptions<PromptActivateHistoryEntity>): Promise<PromptActivateHistories[]> {
    const findManyOptions: FindOneOptions<PromptActivateHistoryEntity> = options ?? {};
    const promptActivateHistory = await this.promptActivateHistoryRepository.find(findManyOptions);
    return TypeormPromptActivateHistoryMapper.toDomains(promptActivateHistory);
  }

  override async save(promptActivateHistory: PromptActivateHistories): Promise<PromptActivateHistories>;
  override async save(promptActivateHistory: PromptActivateHistories[]): Promise<PromptActivateHistories[]>;
  override async save(
    promptActivateHistory: PromptActivateHistories | PromptActivateHistories[],
  ): Promise<PromptActivateHistories | PromptActivateHistories[]> {
    if (Array.isArray(promptActivateHistory)) {
      await this.promptActivateHistoryRepository.save(
        TypeormPromptActivateHistoryMapper.toEntities(promptActivateHistory),
      );
      return promptActivateHistory;
    } else {
      const promptActivateHistoryEntity = TypeormPromptActivateHistoryMapper.toEntity(promptActivateHistory);
      await this.promptActivateHistoryRepository.save(promptActivateHistoryEntity);
      return promptActivateHistory;
    }
  }
}
