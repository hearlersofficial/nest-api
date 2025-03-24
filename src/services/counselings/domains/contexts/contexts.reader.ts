import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { ContextsCriteriaFindMany } from "~counselings/domains/contexts/contexts.criteria";
import { Contexts } from "~counselings/domains/contexts/models/contexts";

import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class ContextsReader {
  abstract findOne(props: { contextId: UniqueEntityId }): Promise<Contexts | null>;
  abstract findMany(props: ContextsCriteriaFindMany): Promise<Contexts[]>;
}
