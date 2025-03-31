import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { PromptVersions } from "~counselings/domains/promptVersions/models/promptVersions";
import { PromptVersionsCriteriaFindMany } from "~counselings/domains/promptVersions/promptVersions.criteria";

import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class PromptVersionsReader {
  abstract findOne(props: { promptVersionId: UniqueEntityId }): Promise<PromptVersions | null>;
  abstract findMany(props: PromptVersionsCriteriaFindMany): Promise<PromptVersions[]>;
}
