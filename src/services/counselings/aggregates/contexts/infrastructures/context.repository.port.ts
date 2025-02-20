import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { Contexts } from "~counselings/aggregates/contexts/domain/contexts";

export const CONTEXT_REPOSITORY = Symbol("CONTEXT_REPOSITORY");

export interface ContextsRepositoryPort {
  create(context: Contexts): Promise<Contexts>;
  update(context: Contexts): Promise<Contexts>;
  findOne(contextId: UniqueEntityId): Promise<Contexts>;
  findAll(): Promise<Contexts[]>;
}
