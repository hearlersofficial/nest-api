import { ContextService } from "~counselings/aggregates/contexts/applications/context.service";
import { FindContextByIdQuery } from "~counselings/aggregates/contexts/applications/queries/FindContextById/FindContextById.query";
import { Contexts } from "~counselings/aggregates/contexts/domain/contexts";

import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(FindContextByIdQuery)
export class FindContextByIdHandler implements IQueryHandler<FindContextByIdQuery> {
  constructor(private readonly contextService: ContextService) {}

  async execute(query: FindContextByIdQuery): Promise<Contexts> {
    const context = await this.contextService.getById(query.contextId);
    return context;
  }
}
