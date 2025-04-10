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

  async findActiveOne(): Promise<PromptVersions | null> {
    const existingActiveVersions = await this.findMany({ isActive: true });
    if (existingActiveVersions.length > 0) {
      return existingActiveVersions[0];
    }
    return null;
  }

  async getActiveOne(): Promise<PromptVersions> {
    const activeVersion = await this.findActiveOne();
    if (!activeVersion) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Active PromptVersion not found");
    }
    return activeVersion;
  }

  async getTemporaryOne(): Promise<PromptVersions> {
    const existingTemporaryVersions = await this.findMany({ isTemporary: true });
    if (existingTemporaryVersions.length > 0) {
      return existingTemporaryVersions[0];
    }

    // 수정중인 임시버전이 없을 경우 새롭게 생성
    const newTemporaryVersion = await this.create({});

    // 활성화 버전이 있을 경우 해당 내용 복사
    const activeVersion = await this.findActiveOne();
    if (activeVersion) {
      newTemporaryVersion.clonePrompts(activeVersion);
      await this.update(newTemporaryVersion);
    }
    return newTemporaryVersion;
  }
}
