import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { Contexts } from "~counselings/aggregates/contexts/domain/contexts";
import {
  CONTEXT_REPOSITORY,
  ContextsRepositoryPort,
} from "~counselings/aggregates/contexts/infrastructures/context.repository.port";

import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class ContextReader {
  constructor(
    @Inject(CONTEXT_REPOSITORY)
    private readonly contextRepository: ContextsRepositoryPort,
  ) {}

  async findOne(contextId: UniqueEntityId): Promise<Contexts> {
    const context = await this.contextRepository.findOne(contextId);
    return context;
  }

  // NOTE: option이 필요하면 findMany로 분리
  async findAll(): Promise<Contexts[]> {
    const contexts = await this.contextRepository.findAll();
    return contexts;
  }
}
