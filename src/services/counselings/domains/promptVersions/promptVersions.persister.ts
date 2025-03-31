import { PromptVersions, PromptVersionsNewProps } from "~counselings/domains/promptVersions/models/promptVersions";

import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class PromptVersionsPersister {
  abstract create(newProps: PromptVersionsNewProps): Promise<PromptVersions>;
  abstract update(promptVersion: PromptVersions): Promise<PromptVersions>;
  abstract updateMany(promptVersions: PromptVersions[]): Promise<PromptVersions[]>;
}
