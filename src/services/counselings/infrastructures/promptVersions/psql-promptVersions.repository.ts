import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { PromptVersionEntity } from "~shared/core/infrastructure/entities/prompts/PromptVersions.entity";
import { PromptVersions } from "~counselings/domains/promptVersions/models/promptVersions";
import { PsqlPromptVersionsMapper } from "~counselings/infrastructures/promptVersions/mappers/psql.promptVersions.mapper";
import { PromptVersionsRepository } from "~counselings/infrastructures/promptVersions/promptVersions.repository";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, FindOneOptions, FindOptionsRelations, Repository } from "typeorm";

@Injectable()
export class PsqlPromptVersionsRepository extends PromptVersionsRepository {
  private readonly promptVersionsFindOptionsRelation: FindOptionsRelations<PromptVersionEntity> = {
    promptByCounselors: true,
    promptByTones: true,
  };

  constructor(
    @InjectRepository(PromptVersionEntity)
    private readonly promptVersionsRepository: Repository<PromptVersionEntity>,
  ) {
    super();
  }

  override async findByPromptVersionId(promptVersionId: UniqueEntityId, options?: FindOneOptions<PromptVersionEntity>): Promise<PromptVersions | null> {
    const findOneOptions: FindOneOptions<PromptVersionEntity> = options ?? {};
    findOneOptions.where = {
      ...findOneOptions.where,
      id: promptVersionId.getString(),
    };
    findOneOptions.relations = { ...findOneOptions.relations, ...this.promptVersionsFindOptionsRelation };
    const promptVersion = await this.promptVersionsRepository.findOne(findOneOptions);
    return promptVersion ? PsqlPromptVersionsMapper.toDomain(promptVersion) : null;
  }

  override async findMany(options?: FindManyOptions<PromptVersionEntity>): Promise<PromptVersions[]> {
    const findManyOptions: FindManyOptions<PromptVersionEntity> = options ?? {};
    findManyOptions.relations = { ...findManyOptions.relations, ...this.promptVersionsFindOptionsRelation };
    const promptVersions = await this.promptVersionsRepository.find(findManyOptions);
    return PsqlPromptVersionsMapper.toDomains(promptVersions);
  }

  override async save(promptVersion: PromptVersions): Promise<PromptVersions>;
  override async save(promptVersions: PromptVersions[]): Promise<PromptVersions[]>;
  async save(promptVersion: PromptVersions | PromptVersions[]): Promise<PromptVersions | PromptVersions[]> {
    if (Array.isArray(promptVersion)) {
      await this.promptVersionsRepository.save(PsqlPromptVersionsMapper.toEntities(promptVersion));
      return promptVersion;
    } else {
      const promptVersionEntity = PsqlPromptVersionsMapper.toEntity(promptVersion);
      await this.promptVersionsRepository.save(promptVersionEntity);
      return promptVersion;
    }
  }
}
