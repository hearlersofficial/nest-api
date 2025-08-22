import { PromptVersions } from "~counselings/domains/prompt-versions/models/prompt-versions";
import * as PromptVersionsCriteria from "~counselings/domains/prompt-versions/prompt-versions.criteria";

import { Injectable } from "@nestjs/common";
import { PromptVersionId } from "~common/shared-kernel/identifiers/prompt-version.id";

@Injectable()
export abstract class PromptVersionsReader {
  abstract findOne(props: { promptVersionId: PromptVersionId; withDeleted?: boolean }): Promise<PromptVersions | null>;
  abstract findMany(props: PromptVersionsCriteria.FindManyOptions): Promise<PromptVersions[]>;
}
