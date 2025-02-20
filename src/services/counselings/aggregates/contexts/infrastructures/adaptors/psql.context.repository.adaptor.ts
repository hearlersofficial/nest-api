import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { ContextEntity } from "~shared/core/infrastructure/entities/prompts/Contexts.entity";
import { Contexts } from "~counselings/aggregates/contexts/domain/contexts";
import { PsqlContextMapper } from "~counselings/aggregates/contexts/infrastructures/adaptors/mappers/psql.context.mapper";
import { ContextsRepositoryPort } from "~counselings/aggregates/contexts/infrastructures/context.repository.port";

import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

export class PsqlContextRepositoryAdaptor implements ContextsRepositoryPort {
  constructor(
    @InjectRepository(ContextEntity)
    private readonly contextsRepository: Repository<ContextEntity>,
  ) {}

  async create(context: Contexts): Promise<Contexts> {
    const entity = PsqlContextMapper.toEntity(context);
    await this.contextsRepository.save(entity);
    return context;
  }

  async update(context: Contexts): Promise<Contexts> {
    const entity = PsqlContextMapper.toEntity(context);
    await this.contextsRepository.save(entity);
    return context;
  }

  async findOne(contextId: UniqueEntityId): Promise<Contexts> {
    const entity = await this.contextsRepository.findOne({ where: { id: contextId.getString() } });
    return PsqlContextMapper.toDomain(entity);
  }

  async findAll(): Promise<Contexts[]> {
    const entities = await this.contextsRepository.find();
    return entities.map((entity) => PsqlContextMapper.toDomain(entity));
  }
}
