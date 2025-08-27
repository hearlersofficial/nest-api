import { PromptVersionInfo } from "~counselings/domains/prompt-versions/models/prompt-version.info";
import { PromptVersions, PromptVersionsNewProps } from "~counselings/domains/prompt-versions/models/prompt-versions";
import * as PromptVersionsCriteria from "~counselings/domains/prompt-versions/prompt-versions.criteria";
import { PromptVersionsReader } from "~counselings/domains/prompt-versions/prompt-versions.reader";
import { PromptVersionsStore } from "~counselings/domains/prompt-versions/prompt-versions.store";
import { AiModel } from "~proto/com/hearlers/v1/model/counsel_prompt_pb";

import { HttpStatus, Injectable } from "@nestjs/common";
import { isDefined } from "~common/shared/utils/validate";
import { PromptVersionId } from "~common/shared-kernel/identifiers/prompt-version.id";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class PromptVersionsService {
  constructor(
    private readonly promptVersionsReader: PromptVersionsReader,
    private readonly promptVersionsPersister: PromptVersionsStore,
  ) {}

  async getOne(props: { promptVersionId: PromptVersionId; withDeleted?: boolean }): Promise<PromptVersionInfo> {
    const promptVersion = await this.promptVersionsReader.findOne(props);
    if (!promptVersion) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "PromptVersion not found");
    }
    return PromptVersionInfo.fromDomain(promptVersion);
  }

  async getMany(props: PromptVersionsCriteria.FindManyOptions): Promise<PromptVersionInfo[]> {
    const promptVersions = await this.promptVersionsReader.findMany(props);
    return PromptVersionInfo.fromDomainArray(promptVersions);
  }

  private async findActiveOne(): Promise<PromptVersions | null> {
    const existingActiveVersions = await this.promptVersionsReader.findMany({ isActive: true });
    if (existingActiveVersions.length > 0) {
      return existingActiveVersions[0];
    }
    return null;
  }

  async getActiveOne(): Promise<PromptVersionInfo> {
    const activeVersion = await this.findActiveOne();
    if (!activeVersion) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Active PromptVersion not found");
    }
    return PromptVersionInfo.fromDomain(activeVersion);
  }

  @Transactional()
  private async findTemporaryOne(): Promise<PromptVersions | null> {
    const existingTemporaryVersions = await this.promptVersionsReader.findMany({
      isTemporary: true,
      withDeleted: false,
    });
    if (existingTemporaryVersions.length > 0) {
      return existingTemporaryVersions[0];
    }
    return null;
  }

  async getTemporaryOne(): Promise<PromptVersionInfo> {
    const temporaryVersion = await this.findTemporaryOne();
    if (!temporaryVersion) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Temporary PromptVersion not found");
    }
    return PromptVersionInfo.fromDomain(temporaryVersion);
  }

  @Transactional()
  async createTemporaryPromptVersion(props: PromptVersionsNewProps): Promise<PromptVersionInfo> {
    const temporaryVersion = await this.findTemporaryOne();
    if (isDefined(temporaryVersion)) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "Temporary PromptVersion already exists");
    }
    const newPromptVersion = await this.promptVersionsPersister.create(props);
    return PromptVersionInfo.fromDomain(newPromptVersion);
  }

  @Transactional()
  async saveTemporaryPromptVersion(props: {
    name: string;
    description: string;
    isBookmarked: boolean;
    aiModel: AiModel;
  }): Promise<PromptVersionInfo> {
    const { name, description, isBookmarked, aiModel } = props;

    const temporaryVersion = await this.findTemporaryOne();
    if (!temporaryVersion) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Temporary PromptVersion not found");
    }
    const saveVersionResult = temporaryVersion.saveVersion({
      name,
      description,
      isBookmarked,
      aiModel,
    });
    if (saveVersionResult.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, saveVersionResult.error as string);
    }
    await this.promptVersionsPersister.update(temporaryVersion);

    return PromptVersionInfo.fromDomain(temporaryVersion);
  }

  @Transactional()
  async updatePromptVersion(props: {
    promptVersionId: PromptVersionId;
    name?: string;
    description?: string;
    isBookmarked?: boolean;
    aiModel?: AiModel;
  }): Promise<PromptVersionInfo> {
    const { promptVersionId, name, description, isBookmarked, aiModel } = props;
    const promptVersion = await this.promptVersionsReader.findOne({ promptVersionId });
    if (!promptVersion) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "PromptVersion not found");
    }

    const updateResult = promptVersion.updateBasicInfo({
      name,
      description,
      isBookmarked,
      aiModel,
    });
    if (updateResult.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, updateResult.error as string);
    }

    await this.promptVersionsPersister.update(promptVersion);
    return PromptVersionInfo.fromDomain(promptVersion);
  }

  @Transactional()
  async activatePromptVersion(props: { promptVersionId: PromptVersionId }): Promise<PromptVersionInfo> {
    const { promptVersionId } = props;
    const promptVersion = await this.promptVersionsReader.findOne({ promptVersionId });
    if (!promptVersion) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "PromptVersion not found");
    }

    const activeVersions = await this.promptVersionsReader.findMany({ isActive: true });
    if (activeVersions.length > 0) {
      for (const activeVersion of activeVersions) {
        const deactivateResult = activeVersion.deactivate();
        if (deactivateResult.isFailure) {
          throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, deactivateResult.error as string);
        }
        await this.promptVersionsPersister.update(activeVersion);
      }
    }
    const activateResult = promptVersion.activate();
    if (activateResult.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, activateResult.error as string);
    }
    await this.promptVersionsPersister.update(promptVersion);

    return PromptVersionInfo.fromDomain(promptVersion);
  }

  @Transactional()
  async deletePromptVersions(props: { promptVersionIds: PromptVersionId[] }): Promise<void> {
    const { promptVersionIds } = props;
    const promptVersions = await this.promptVersionsReader.findMany({ ids: promptVersionIds, orderBy: { id: "DESC" } });
    if (promptVersions.length !== new Set(promptVersionIds.map((id) => id.getString())).size) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "PromptVersion not found");
    }

    for (const promptVersion of promptVersions) {
      const deleteResult = promptVersion.delete();
      if (deleteResult.isFailure) {
        throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, deleteResult.error as string);
      }
    }
    await this.promptVersionsPersister.updateMany(promptVersions);
  }
}
