import { PersonaService } from "~counselings/aggregates/personas/applications/persona.service";
import { FindPersonasQuery } from "~counselings/aggregates/personas/applications/queries/FindPersonas/FindPersonas.query";
import { Personas } from "~counselings/aggregates/personas/domain/personas";

import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(FindPersonasQuery)
export class FindPersonasHandler implements IQueryHandler<FindPersonasQuery> {
  constructor(private readonly personaService: PersonaService) {}

  async execute(query: FindPersonasQuery): Promise<Personas[]> {
    const personas = await this.personaService.findMany(query.props);
    return personas;
  }
}
