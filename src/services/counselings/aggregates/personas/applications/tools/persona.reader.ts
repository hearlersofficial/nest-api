import { Personas } from "~counselings/aggregates/personas/domain/personas";
import {
  PERSONA_REPOSITORY,
  PersonasRepositoryPort,
} from "~counselings/aggregates/personas/infrastructures/persona.repository.port";

import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class PersonaReader {
  constructor(
    @Inject(PERSONA_REPOSITORY)
    private readonly personaRepository: PersonasRepositoryPort,
  ) {}

  async findOne(personaId: string): Promise<Personas> {
    const persona = await this.personaRepository.findOne(personaId);
    return persona;
  }

  async findAll(): Promise<Personas[]> {
    const personas = await this.personaRepository.findAll();
    return personas;
  }
}
