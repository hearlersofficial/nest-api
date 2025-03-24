import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { ContextsCriteriaFindMany } from "~counselings/domains/contexts/contexts.criteria";
import { ContextsPersister } from "~counselings/domains/contexts/contexts.persister";
import { ContextsReader } from "~counselings/domains/contexts/contexts.reader";
import { Contexts, ContextsNewProps } from "~counselings/domains/contexts/models/contexts";

import { HttpStatus, Injectable } from "@nestjs/common";

@Injectable()
export class ContextsService {
  constructor(private readonly contextsReader: ContextsReader, private readonly contextsPersister: ContextsPersister) {}

  async create(newProps: ContextsNewProps): Promise<Contexts> {
    return this.contextsPersister.create(newProps);
  }

  async update(context: Contexts): Promise<Contexts> {
    return this.contextsPersister.update(context);
  }

  async findOne(props: { contextId: UniqueEntityId }): Promise<Contexts | null> {
    return this.contextsReader.findOne(props);
  }

  async getOne(props: { contextId: UniqueEntityId }): Promise<Contexts> {
    const context = await this.findOne(props);
    if (!context) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Context not found");
    }
    return context;
  }

  async findMany(props: ContextsCriteriaFindMany): Promise<Contexts[]> {
    return this.contextsReader.findMany(props);
  }
}
