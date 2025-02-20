import { Personas } from "~counselings/aggregates/personas/domain/personas";

export const PERSONA_REPOSITORY = Symbol("PERSONA_REPOSITORY");

export interface PersonasRepositoryPort {
  create(persona: Personas): Promise<Personas>;
  update(persona: Personas): Promise<Personas>;
  findOne(personaId: string): Promise<Personas>;
  findAll(): Promise<Personas[]>;
}
