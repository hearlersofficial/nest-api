import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { ContextsPersister } from "~counselings/domains/contexts/contexts.persister";
import { Contexts, ContextsNewProps } from "~counselings/domains/contexts/models/contexts";
import { ContextsRepository } from "~counselings/infrastructures/contexts/contexts.repository";

import { HttpStatus, Injectable } from "@nestjs/common";

@Injectable()
export class RepositoryContextsPersister extends ContextsPersister {
  constructor(private readonly contextsRepository: ContextsRepository) {
    super();
  }

  override async create(newProps: ContextsNewProps): Promise<Contexts> {
    const contextResult = Contexts.createNew(newProps);
    if (contextResult.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, contextResult.error as string);
    }
    return this.contextsRepository.save(contextResult.value);
  }

  override async update(context: Contexts): Promise<Contexts> {
    return this.contextsRepository.save(context);
  }

  override async updateMany(contexts: Contexts[]): Promise<Contexts[]> {
    return this.contextsRepository.save(contexts);
  }
}
