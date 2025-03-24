import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { ContextsService } from "~counselings/domains/contexts/contexts.service";

import { Injectable } from "@nestjs/common";

@Injectable()
export class ContextsFacade {
  constructor(private readonly contextsService: ContextsService) {}

  async createContext(params: { name: string; body: string; placeholders: string[] }) {
    const { name, body, placeholders } = params;
    return this.contextsService.create({ name, body, placeholders });
  }

  async findContexts(params: { name?: string }) {
    const { name } = params;
    return this.contextsService.findMany({ name });
  }

  async findContextById(params: { contextId: UniqueEntityId }) {
    const { contextId } = params;
    return this.contextsService.getOne({ contextId });
  }

  async updateContext(params: { contextId: UniqueEntityId; name?: string; body?: string; placeholders?: string[] }) {
    const { contextId, name, body, placeholders } = params;
    const context = await this.contextsService.getOne({ contextId });

    context.update({ name, body, placeholders });
    return this.contextsService.update(context);
  }
}
