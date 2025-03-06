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

  async findOne(contextId: UniqueEntityId): Promise<Contexts | null> {
    const context = await this.contextRepository.findOne(contextId);
    if (!context) {
      return null;
    }
    return context;
  }

  async findAll(): Promise<Contexts[]> {
    const contexts = await this.contextRepository.findAll();
    return contexts;
  }

  async findMany(props: { name?: string }): Promise<Contexts[]> {
    const contexts = await this.contextRepository.findMany(props);
    return contexts;
  }
}
