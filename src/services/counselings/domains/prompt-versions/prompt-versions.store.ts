import { PromptVersions, PromptVersionsNewProps } from "~counselings/domains/prompt-versions/models/prompt-versions";

import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class PromptVersionsStore {
  abstract create(newProps: PromptVersionsNewProps): Promise<PromptVersions>;
  abstract update(promptVersion: PromptVersions): Promise<PromptVersions>;
  abstract updateMany(promptVersions: PromptVersions[]): Promise<PromptVersions[]>;
}
