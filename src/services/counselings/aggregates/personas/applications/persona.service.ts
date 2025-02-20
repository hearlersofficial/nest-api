import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { PersonaPersistor } from "~counselings/aggregates/personas/applications/tools/persona.persistor";
import { PersonaReader } from "~counselings/aggregates/personas/applications/tools/persona.reader";
import { Personas } from "~counselings/aggregates/personas/domain/personas";

import { Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class PersonaService {
  constructor(private readonly personaReader: PersonaReader, private readonly personaPersistor: PersonaPersistor) {}

  async create(persona: Personas): Promise<Personas> {
    const createdPersona = await this.personaPersistor.create(persona);
    return createdPersona;
  }

  async update(persona: Personas): Promise<Personas> {
    const updatedPersona = await this.personaPersistor.update(persona);
    return updatedPersona;
  }

  async findOne(personaId: UniqueEntityId): Promise<Personas> {
    const persona = await this.personaReader.findOne(personaId);
    return persona;
  }

  async findAll(): Promise<Personas[]> {
    const personas = await this.personaReader.findAll();
    return personas;
  }

  async getOne(personaId: UniqueEntityId): Promise<Personas> {
    const persona: Personas | null = await this.findOne(personaId);
    if (!persona) {
      throw new NotFoundException("Persona not found");
    }
    return persona;
  }

  async getAll(): Promise<Personas[]> {
    const personas = await this.findAll();
    if (personas.length === 0) {
      throw new NotFoundException("Personas not found");
    }
    return personas;
  }
}
