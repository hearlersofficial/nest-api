import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
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

  async findOne(personaId: UniqueEntityId): Promise<Personas> {
    const persona = await this.personaRepository.findOne(personaId);
    return persona;
  }

  // NOTE: option이 필요하면 findMany로 분리
  async findAll(): Promise<Personas[]> {
    const personas = await this.personaRepository.findAll();
    return personas;
  }
}
