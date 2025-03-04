import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { PersonaPersistor } from "~counselings/aggregates/personas/applications/tools/persona.persistor";
import { PersonaReader } from "~counselings/aggregates/personas/applications/tools/persona.reader";
import { Personas, PersonasNewProps } from "~counselings/aggregates/personas/domain/personas";

import { HttpStatus, Injectable } from "@nestjs/common";

@Injectable()
export class PersonaService {
  constructor(private readonly personaReader: PersonaReader, private readonly personaPersistor: PersonaPersistor) {}

  async create(personaNewProps: PersonasNewProps): Promise<Personas> {
    const personaOrError = Personas.createNew(personaNewProps);
    if (personaOrError.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, personaOrError.error);
    }
    const persona = personaOrError.value;
    const createdPersona = await this.personaPersistor.create(persona);
    return createdPersona;
  }

  async update(persona: Personas): Promise<Personas> {
    const updatedPersona = await this.personaPersistor.update(persona);
    return updatedPersona;
  }

  async findById(personaId: UniqueEntityId): Promise<Personas> {
    const persona = await this.personaReader.findOne(personaId);
    return persona;
  }

  async findAll(): Promise<Personas[]> {
    const personas = await this.personaReader.findAll();
    return personas;
  }

  async findMany(props: { counselorId?: UniqueEntityId }): Promise<Personas[]> {
    const personas = await this.personaReader.findMany(props);
    return personas;
  }

  async getById(personaId: UniqueEntityId): Promise<Personas> {
    const persona: Personas | null = await this.findById(personaId);
    if (!persona) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Persona not found");
    }
    return persona;
  }

  async getAll(): Promise<Personas[]> {
    const personas = await this.findAll();
    if (personas.length === 0) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Personas not found");
    }
    return personas;
  }

  async getMany(props: { counselorId?: UniqueEntityId }): Promise<Personas[]> {
    const personas = await this.findMany(props);
    if (personas.length === 0) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Personas not found");
    }
    return personas;
  }
}
