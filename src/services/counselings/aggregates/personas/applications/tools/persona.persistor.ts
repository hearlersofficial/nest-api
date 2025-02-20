import { Personas } from "~counselings/aggregates/personas/domain/personas";
import {
  PERSONA_REPOSITORY,
  PersonasRepositoryPort,
} from "~counselings/aggregates/personas/infrastructures/persona.repository.port";

import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class PersonaPersistor {
  constructor(
    @Inject(PERSONA_REPOSITORY)
    private readonly personaRepository: PersonasRepositoryPort,
  ) {}

  async create(persona: Personas): Promise<Personas> {
    const createdPersona = await this.personaRepository.create(persona);
    return createdPersona;
  }

  async update(persona: Personas): Promise<Personas> {
    const updatedPersona = await this.personaRepository.update(persona);
    return updatedPersona;
  }
}
