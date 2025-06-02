import { PromptVersionsRepository } from "~counselings/domains/promptVersions/infrastructures/promptVersions.repository";
import { PromptVersions, PromptVersionsNewProps } from "~counselings/domains/promptVersions/models/promptVersions";
import { PromptVersionsPersister } from "~counselings/domains/promptVersions/promptVersions.persister";

import { HttpStatus, Injectable } from "@nestjs/common";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";

@Injectable()
export class RepositoryPromptVersionsPersister extends PromptVersionsPersister {
  constructor(private readonly promptVersionsRepository: PromptVersionsRepository) {
    super();
  }

  override async create(newProps: PromptVersionsNewProps): Promise<PromptVersions> {
    const promptVersionResult = PromptVersions.createNew(newProps);
    if (promptVersionResult.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, promptVersionResult.error as string);
    }
    return this.promptVersionsRepository.save(promptVersionResult.value);
  }

  override async update(promptVersion: PromptVersions): Promise<PromptVersions> {
    return this.promptVersionsRepository.save(promptVersion);
  }

  override async updateMany(promptVersions: PromptVersions[]): Promise<PromptVersions[]> {
    return this.promptVersionsRepository.save(promptVersions);
  }
}
