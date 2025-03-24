import { Contexts, ContextsNewProps } from "~counselings/domains/contexts/models/contexts";

import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class ContextsPersister {
  abstract create(newProps: ContextsNewProps): Promise<Contexts>;
  abstract update(context: Contexts): Promise<Contexts>;
  abstract updateMany(contexts: Contexts[]): Promise<Contexts[]>;
}
