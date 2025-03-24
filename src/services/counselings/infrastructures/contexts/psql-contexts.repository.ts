import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { ContextEntity } from "~shared/core/infrastructure/entities/prompts/Contexts.entity";
import { Contexts } from "~counselings/domains/contexts/models/contexts";
import { ContextsRepository } from "~counselings/infrastructures/contexts/contexts.repository";
import { PsqlContextsMapper } from "~counselings/infrastructures/contexts/mappers/psql.contexts.mapper";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, FindOneOptions, Repository } from "typeorm";

@Injectable()
export class PsqlContextsRepository extends ContextsRepository {
  constructor(
    @InjectRepository(ContextEntity)
    private readonly contextsRepository: Repository<ContextEntity>,
  ) {
    super();
  }

  override async findByContextId(contextId: UniqueEntityId, options?: FindOneOptions<ContextEntity>): Promise<Contexts | null> {
    const findOneOptions: FindOneOptions<ContextEntity> = options ?? {};
    findOneOptions.where = {
      ...findOneOptions.where,
      id: contextId.getString(),
    };
    const context = await this.contextsRepository.findOne(findOneOptions);
    return context ? PsqlContextsMapper.toDomain(context) : null;
  }

  override async findMany(options?: FindManyOptions<ContextEntity>): Promise<Contexts[]> {
    const findManyOptions: FindManyOptions<ContextEntity> = options ?? {};
    const contexts = await this.contextsRepository.find(findManyOptions);
    return PsqlContextsMapper.toDomains(contexts);
  }

  override async save(context: Contexts): Promise<Contexts>;
  override async save(contexts: Contexts[]): Promise<Contexts[]>;
  async save(context: Contexts | Contexts[]): Promise<Contexts | Contexts[]> {
    if (Array.isArray(context)) {
      await this.contextsRepository.save(PsqlContextsMapper.toEntities(context));
      return context;
    } else {
      const contextEntity = PsqlContextsMapper.toEntity(context);
      await this.contextsRepository.save(contextEntity);
      return context;
    }
  }
}
