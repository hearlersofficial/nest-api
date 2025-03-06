import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { ContextEntity } from "~shared/core/infrastructure/entities/prompts/Contexts.entity";
import { Contexts } from "~counselings/aggregates/contexts/domain/contexts";
import { PsqlContextMapper } from "~counselings/aggregates/contexts/infrastructures/adaptors/mappers/psql.context.mapper";
import {
  ContextsRepositoryPort,
  FindManyPropsInContextsRepository,
} from "~counselings/aggregates/contexts/infrastructures/context.repository.port";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";

@Injectable()
export class PsqlContextRepositoryAdaptor implements ContextsRepositoryPort {
  constructor(
    @InjectRepository(ContextEntity)
    private readonly contextsRepository: Repository<ContextEntity>,
  ) {}

  async create(context: Contexts): Promise<Contexts> {
    const contextEntity = PsqlContextMapper.toEntity(context);
    await this.contextsRepository.save(contextEntity);
    return context;
  }

  async update(context: Contexts): Promise<Contexts> {
    const contextEntity = PsqlContextMapper.toEntity(context);
    await this.contextsRepository.update(contextEntity.id, contextEntity);
    return context;
  }

  async findOne(contextId: UniqueEntityId): Promise<Contexts | null> {
    const contextEntity: ContextEntity | null = await this.contextsRepository.findOne({
      where: { id: contextId.getString() },
    });
    if (!contextEntity) {
      return null;
    }
    return PsqlContextMapper.toDomain(contextEntity);
  }

  async findAll(): Promise<Contexts[]> {
    const contextEntities = await this.contextsRepository.find();
    return contextEntities
      .map((contextEntity) => PsqlContextMapper.toDomain(contextEntity))
      .filter((context) => context !== null);
  }

  async findMany(props: FindManyPropsInContextsRepository): Promise<Contexts[]> {
    const findOptionsWhere: FindOptionsWhere<ContextEntity> = {};
    if (props.name) {
      findOptionsWhere.name = props.name;
    }
    const contextEntities = await this.contextsRepository.find({ where: findOptionsWhere });
    return contextEntities
      .map((contextEntity) => PsqlContextMapper.toDomain(contextEntity))
      .filter((context) => context !== null);
  }
}
