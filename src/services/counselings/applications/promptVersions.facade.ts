import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { GetTemporaryPromptVersionUseCase } from "~counselings/applications/use-cases/get-temporary-prompt-version";
import { PromptVersions } from "~counselings/domains/promptVersions/models/promptVersions";
import { PromptVersionsService } from "~counselings/domains/promptVersions/promptVersions.service";

import { HttpStatus, Injectable } from "@nestjs/common";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class PromptVersionsFacade {
  constructor(
    private readonly promptVersionsService: PromptVersionsService,
    private readonly getTemporaryPromptVersionUseCase: GetTemporaryPromptVersionUseCase,
  ) {}
  async findPromptVersions(params: { name?: string }): Promise<PromptVersions[]> {
    const { name } = params;
    return this.promptVersionsService.findMany({ name, isTemporary: false });
  }

  async findPromptVersionById(params: { promptVersionId: UniqueEntityId }): Promise<PromptVersions> {
    const { promptVersionId } = params;
    return this.promptVersionsService.getOne({ promptVersionId });
  }

  // 현재 수정중인 임시버전 조회
  @Transactional()
  async getTemporaryPromptVersion(): Promise<PromptVersions> {
    const temporaryVersionResult = await this.getTemporaryPromptVersionUseCase.execute({});
    if (!temporaryVersionResult.ok) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, "Temporary version creation failed");
    }
    return temporaryVersionResult.temporaryVersion;
  }

  // 기존 버전을 임시버전으로 불러오기
  // - 기존 버전의 모든 프롬프트를 임시버전으로 복사
  @Transactional()
  async loadExistingPromptVersion(params: { promptVersionId: UniqueEntityId }): Promise<PromptVersions> {
    const { promptVersionId } = params;
    const promptVersion = await this.promptVersionsService.getOne({ promptVersionId });
    const temporaryVersionResult = await this.getTemporaryPromptVersionUseCase.execute({});
    if (!temporaryVersionResult.ok) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, "Temporary version creation failed");
    }
    const temporaryVersion = temporaryVersionResult.temporaryVersion;
    temporaryVersion.clonePrompts(promptVersion);
    await this.promptVersionsService.update(temporaryVersion);
    return temporaryVersion;
  }

  // 임시버전 저장
  @Transactional()
  async saveTemporaryVersion(params: { name: string; description: string }): Promise<PromptVersions> {
    const { name, description } = params;
    const temporaryVersionResult = await this.getTemporaryPromptVersionUseCase.execute({});
    if (!temporaryVersionResult.ok) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, "Temporary version creation failed");
    }
    const temporaryVersion = temporaryVersionResult.temporaryVersion;
    const saveVersionResult = temporaryVersion.saveVersion({ name, description });
    if (saveVersionResult.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, saveVersionResult.error as string);
    }
    await this.promptVersionsService.update(temporaryVersion);
    return temporaryVersion;
  }

  // 버전 활성화(실 서비스 적용)
  @Transactional()
  async activatePromptVersion(params: { promptVersionId: UniqueEntityId }): Promise<PromptVersions> {
    const { promptVersionId } = params;
    const promptVersion = await this.promptVersionsService.getOne({ promptVersionId });
    const activeVersions = await this.promptVersionsService.findMany({ isActive: true });
    if (activeVersions.length > 0) {
      for (const activeVersion of activeVersions) {
        const deactivateResult = activeVersion.deactivate();
        if (deactivateResult.isFailure) {
          throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, deactivateResult.error as string);
        }
        await this.promptVersionsService.update(activeVersion);
      }
    }
    const activateResult = promptVersion.activate();
    if (activateResult.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, activateResult.error as string);
    }
    await this.promptVersionsService.update(promptVersion);
    return promptVersion;
  }
}
