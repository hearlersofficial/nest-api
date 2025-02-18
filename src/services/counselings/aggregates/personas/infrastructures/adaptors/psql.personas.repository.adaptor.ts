import { PersonaEntity } from "~shared/core/infrastructure/entities/prompts/Personas.entity";
import { PersonasRepositoryPort } from "~counselings/aggregates/personas/infrastructures/personas.repository.port";

import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

export class PsqlPersonasRepositoryAdaptor implements PersonasRepositoryPort {
  constructor(
    @InjectRepository(PersonaEntity)
    private readonly personasRepository: Repository<PersonaEntity>,
  ) {}
}
