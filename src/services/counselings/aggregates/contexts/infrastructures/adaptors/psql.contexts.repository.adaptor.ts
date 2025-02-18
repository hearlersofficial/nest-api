import { ContextEntity } from "~shared/core/infrastructure/entities/prompts/Contexts.entity";
import { ContextsRepositoryPort } from "~counselings/aggregates/contexts/infrastructures/contexts.repository.port";

import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

export class PsqlContextsRepositoryAdaptor implements ContextsRepositoryPort {
  constructor(
    @InjectRepository(ContextEntity)
    private readonly contextsRepository: Repository<ContextEntity>,
  ) {}
}
