import { PromptVersionInfo } from "~counselings/domains/promptVersions/models/promptVersion.info";
import { PromptVersions } from "~counselings/domains/promptVersions/models/promptVersions";
import { PromptVersionsCriteriaFindMany } from "~counselings/domains/promptVersions/promptVersions.criteria";
import { PromptVersionsPersister } from "~counselings/domains/promptVersions/promptVersions.persister";
import { PromptVersionsReader } from "~counselings/domains/promptVersions/promptVersions.reader";
import { AiModel } from "~proto/com/hearlers/v1/model/counsel_prompt_pb";

import { HttpStatus, Injectable } from "@nestjs/common";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class PromptVersionsService {
  constructor(
    private readonly promptVersionsReader: PromptVersionsReader,
    private readonly promptVersionsPersister: PromptVersionsPersister,
  ) {}

  async getOne(props: { promptVersionId: UniqueEntityId }): Promise<PromptVersionInfo> {
    const promptVersion = await this.promptVersionsReader.findOne(props);
    if (!promptVersion) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "PromptVersion not found");
    }
    return PromptVersionInfo.fromDomain(promptVersion);
  }

  async getMany(props: PromptVersionsCriteriaFindMany): Promise<PromptVersionInfo[]> {
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
  private async findTemporaryOne(): Promise<PromptVersions> {
    const existingTemporaryVersions = await this.promptVersionsReader.findMany({ isTemporary: true });
    if (existingTemporaryVersions.length > 0) {
      return existingTemporaryVersions[0];
    }

    // 수정중인 임시버전이 없을 경우 새롭게 생성
    const newTemporaryVersion = await this.promptVersionsPersister.create({});

    // 활성화 버전이 있을 경우 해당 내용 복사
    const activeVersion = await this.findActiveOne();
    if (activeVersion) {
      newTemporaryVersion.clonePrompts(activeVersion);
      await this.promptVersionsPersister.update(newTemporaryVersion);
    }
    return newTemporaryVersion;
  }

  async getTemporaryOne(): Promise<PromptVersionInfo> {
    const temporaryVersion = await this.findTemporaryOne();
    return PromptVersionInfo.fromDomain(temporaryVersion);
  }

  @Transactional()
  async loadExistingPromptVersion(props: { promptVersionId: UniqueEntityId }): Promise<PromptVersionInfo> {
    const { promptVersionId } = props;
    const promptVersion = await this.promptVersionsReader.findOne({ promptVersionId });
    if (!promptVersion || promptVersion.deletedAt != null) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "PromptVersion not found");
    }

    if (promptVersion.isTemporary) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "Cannot load a temporary version");
    }

    const temporaryVersion = await this.findTemporaryOne();
    temporaryVersion.clonePrompts(promptVersion);
    await this.promptVersionsPersister.update(temporaryVersion);

    return PromptVersionInfo.fromDomain(temporaryVersion);
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
    promptVersionId: UniqueEntityId;
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
  async activatePromptVersion(props: { promptVersionId: UniqueEntityId }): Promise<PromptVersionInfo> {
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
  async deletePromptVersions(props: { promptVersionIds: UniqueEntityId[] }): Promise<void> {
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

  async updateCounselorScopedPromptInTemporaryVersion(props: {
    counselorId: UniqueEntityId;
    personaPromptId: UniqueEntityId;
  }): Promise<PromptVersionInfo> {
    const { counselorId, personaPromptId } = props;

    const temporaryVersion = await this.findTemporaryOne();
    const updateResult = temporaryVersion.updateCounselorScopedPrompt({
      counselorId,
      personaPromptId,
    });
    if (updateResult.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, updateResult.error as string);
    }
    await this.promptVersionsPersister.update(temporaryVersion);

    return PromptVersionInfo.fromDomain(temporaryVersion);
  }

  async updateToneScopedPromptInTemporaryVersion(props: {
    toneId: UniqueEntityId;
    tonePromptId?: UniqueEntityId;
    firstCounselTechniqueId?: UniqueEntityId;
  }): Promise<PromptVersionInfo> {
    const { toneId, tonePromptId, firstCounselTechniqueId } = props;

    const temporaryVersion = await this.findTemporaryOne();
    const updateResult = temporaryVersion.updateToneScopedPrompt({
      toneId,
      tonePromptId,
      firstCounselTechniqueId,
    });
    if (updateResult.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, updateResult.error as string);
    }
    await this.promptVersionsPersister.update(temporaryVersion);

    return PromptVersionInfo.fromDomain(temporaryVersion);
  }
}
