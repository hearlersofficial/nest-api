import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { ContextPersistor } from "~counselings/aggregates/contexts/applications/tools/context.persistor";
import { ContextReader } from "~counselings/aggregates/contexts/applications/tools/context.reader";
import { Contexts } from "~counselings/aggregates/contexts/domain/contexts";

import { Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class ApplicationContextService {
  constructor(private readonly contextReader: ContextReader, private readonly contextPersistor: ContextPersistor) {}

  async create(context: Contexts): Promise<Contexts> {
    const createdContext = await this.contextPersistor.create(context);
    return createdContext;
  }

  async update(context: Contexts): Promise<Contexts> {
    const updatedContext = await this.contextPersistor.update(context);
    return updatedContext;
  }

  async findOne(contextId: UniqueEntityId): Promise<Contexts> {
    const context = await this.contextReader.findOne(contextId);
    return context;
  }

  async findAll(): Promise<Contexts[]> {
    const contexts = await this.contextReader.findAll();
    return contexts;
  }

  async getOne(contextId: UniqueEntityId): Promise<Contexts> {
    const context: Contexts | null = await this.findOne(contextId);
    if (!context) {
      throw new NotFoundException("Context not found");
    }
    return context;
  }

  async getAll(): Promise<Contexts[]> {
    const contexts = await this.findAll();
    if (contexts.length === 0) {
      throw new NotFoundException("Contexts not found");
    }
    return contexts;
  }
}
