import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { ContextPersistor } from "~counselings/aggregates/contexts/applications/tools/context.persistor";
import { ContextReader } from "~counselings/aggregates/contexts/applications/tools/context.reader";
import { Contexts, ContextsNewProps } from "~counselings/aggregates/contexts/domain/contexts";

import { HttpStatus, Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class ContextService {
  constructor(private readonly contextReader: ContextReader, private readonly contextPersistor: ContextPersistor) {}

  async create(contextNewProps: ContextsNewProps): Promise<Contexts> {
    const contextOrError = Contexts.createNew(contextNewProps);
    if (contextOrError.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, contextOrError.error);
    }
    const context = contextOrError.value;
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

  async findMany(props: { name?: string }): Promise<Contexts[]> {
    const contexts = await this.contextReader.findMany(props);
    return contexts;
  }

  async getById(contextId: UniqueEntityId): Promise<Contexts> {
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

  async getMany(props: { name?: string }): Promise<Contexts[]> {
    const contexts = await this.findMany(props);
    if (contexts.length === 0) {
      throw new NotFoundException("Contexts not found");
    }
    return contexts;
  }
}
