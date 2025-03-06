import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { Contexts } from "~counselings/aggregates/contexts/domain/contexts";

export const CONTEXT_REPOSITORY = Symbol("CONTEXT_REPOSITORY");

export interface ContextsRepositoryPort {
  create(context: Contexts): Promise<Contexts>;
  update(context: Contexts): Promise<Contexts>;
  findOne(contextId: UniqueEntityId): Promise<Contexts | null>;
  findAll(): Promise<Contexts[]>;
  findMany(props: FindManyPropsInContextsRepository): Promise<Contexts[]>;
}

export interface FindManyPropsInContextsRepository {
  name?: string;
}
