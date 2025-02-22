import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { Personas } from "~counselings/aggregates/personas/domain/personas";

export const PERSONA_REPOSITORY = Symbol("PERSONA_REPOSITORY");

export interface PersonasRepositoryPort {
  create(persona: Personas): Promise<Personas>;
  update(persona: Personas): Promise<Personas>;
  findOne(personaId: UniqueEntityId): Promise<Personas>;
  findAll(): Promise<Personas[]>;
  findMany(props: FindManyPropsInPersonasRepository): Promise<Personas[]>;
}

export interface FindManyPropsInPersonasRepository {
  counselorId?: UniqueEntityId;
}
