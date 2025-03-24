import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { ContextEntity } from "~shared/core/infrastructure/entities/prompts/Contexts.entity";
import { Contexts } from "~counselings/domains/contexts/models/contexts";

import { Injectable } from "@nestjs/common";
import { FindManyOptions, FindOneOptions } from "typeorm";

@Injectable()
export abstract class ContextsRepository {
  abstract findByContextId(contextId: UniqueEntityId, options?: FindOneOptions<ContextEntity>): Promise<Contexts | null>;
  abstract findMany(options?: FindManyOptions<ContextEntity>): Promise<Contexts[]>;
  abstract save(context: Contexts): Promise<Contexts>;
  abstract save(contexts: Contexts[]): Promise<Contexts[]>;
}
