import { PromptVersions } from "~counselings/domains/promptVersions/models/promptVersions";
import { PromptVersionsCriteriaFindMany } from "~counselings/domains/promptVersions/promptVersions.criteria";

import { Injectable } from "@nestjs/common";
import { PromptVersionId } from "~common/shared-kernel/identifiers/prompt-version.id";

@Injectable()
export abstract class PromptVersionsReader {
  abstract findOne(props: { promptVersionId: PromptVersionId; withDeleted?: boolean }): Promise<PromptVersions | null>;
  abstract findMany(props: PromptVersionsCriteriaFindMany): Promise<PromptVersions[]>;
}
