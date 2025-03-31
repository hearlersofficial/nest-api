import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { PromptVersions, PromptVersionsNewProps } from "~counselings/domains/promptVersions/models/promptVersions";
import { PromptVersionsCriteriaFindMany } from "~counselings/domains/promptVersions/promptVersions.criteria";
import { PromptVersionsPersister } from "~counselings/domains/promptVersions/promptVersions.persister";
import { PromptVersionsReader } from "~counselings/domains/promptVersions/promptVersions.reader";

import { HttpStatus, Injectable } from "@nestjs/common";

@Injectable()
export class PromptVersionsService {
  constructor(private readonly promptVersionsReader: PromptVersionsReader, private readonly promptVersionsPersister: PromptVersionsPersister) {}

  async create(newProps: PromptVersionsNewProps): Promise<PromptVersions> {
    return this.promptVersionsPersister.create(newProps);
  }

  async update(promptVersion: PromptVersions): Promise<PromptVersions> {
    return this.promptVersionsPersister.update(promptVersion);
  }

  async findOne(props: { promptVersionId: UniqueEntityId }): Promise<PromptVersions | null> {
    return this.promptVersionsReader.findOne(props);
  }

  async getOne(props: { promptVersionId: UniqueEntityId }): Promise<PromptVersions> {
    const promptVersion = await this.findOne(props);
    if (!promptVersion) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "PromptVersion not found");
    }
    return promptVersion;
  }

  async findMany(props: PromptVersionsCriteriaFindMany): Promise<PromptVersions[]> {
    return this.promptVersionsReader.findMany(props);
  }
}
