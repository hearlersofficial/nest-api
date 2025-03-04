import { PersonaService } from "~counselings/aggregates/personas/applications/persona.service";
import { FindPersonaByIdQuery } from "~counselings/aggregates/personas/applications/queries/FindPersonaById/FindPersonaById.query";
import { Personas } from "~counselings/aggregates/personas/domain/personas";

import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(FindPersonaByIdQuery)
export class FindPersonaByIdHandler implements IQueryHandler<FindPersonaByIdQuery> {
  constructor(private readonly personaService: PersonaService) {}

  async execute(query: FindPersonaByIdQuery): Promise<Personas> {
    const persona = await this.personaService.getById(query.personaId);
    return persona;
  }
}
