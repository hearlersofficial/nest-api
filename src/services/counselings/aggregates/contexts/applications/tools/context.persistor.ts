import { Contexts } from "~counselings/aggregates/contexts/domain/contexts";
import {
  CONTEXT_REPOSITORY,
  ContextsRepositoryPort,
} from "~counselings/aggregates/contexts/infrastructures/context.repository.port";

import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class ContextPersistor {
  constructor(
    @Inject(CONTEXT_REPOSITORY)
    private readonly contextRepository: ContextsRepositoryPort,
  ) {}

  async create(context: Contexts): Promise<Contexts> {
    const createdContext = await this.contextRepository.create(context);
    return createdContext;
  }

  async update(context: Contexts): Promise<Contexts> {
    const updatedContext = await this.contextRepository.update(context);
    return updatedContext;
  }
}
