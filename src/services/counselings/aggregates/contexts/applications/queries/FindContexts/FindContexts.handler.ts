import { ContextService } from "~counselings/aggregates/contexts/applications/context.service";
import { FindContextsQuery } from "~counselings/aggregates/contexts/applications/queries/FindContexts/FindContexts.query";
import { Contexts } from "~counselings/aggregates/contexts/domain/contexts";

import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(FindContextsQuery)
export class FindContextsHandler implements IQueryHandler<FindContextsQuery> {
  constructor(private readonly contextService: ContextService) {}

  async execute(query: FindContextsQuery): Promise<Contexts[]> {
    const contexts = await this.contextService.findMany(query.props);
    return contexts;
  }
}
