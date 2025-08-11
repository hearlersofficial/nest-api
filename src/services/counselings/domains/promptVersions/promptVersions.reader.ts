import { PromptVersions } from "~counselings/domains/promptVersions/models/promptVersions";
import { PromptVersionsCriteriaFindMany } from "~counselings/domains/promptVersions/promptVersions.criteria";

import { Injectable } from "@nestjs/common";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";

@Injectable()
export abstract class PromptVersionsReader {
  abstract findOne(props: { promptVersionId: UniqueEntityId; withDeleted?: boolean }): Promise<PromptVersions | null>;
  abstract findMany(props: PromptVersionsCriteriaFindMany): Promise<PromptVersions[]>;
}
