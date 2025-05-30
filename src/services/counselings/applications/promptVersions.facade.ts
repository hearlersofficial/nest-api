import { ValidatePromptVersionUseCase } from "~counselings/applications/use-cases/validate-prompt-version";
import { PromptActivateHistoryService } from "~counselings/domains/promptActivateHistory/promptActivateHistory.service";
import { PromptVersions } from "~counselings/domains/promptVersions/models/promptVersions";
import { PromptVersionsService } from "~counselings/domains/promptVersions/promptVersions.service";
import { GPTModel } from "~proto/com/hearlers/v1/model/counsel_prompt_pb";

import { HttpStatus, Injectable } from "@nestjs/common";
import { getNowDayjs } from "~common/shared/utils/date";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class PromptVersionsFacade {
  constructor(
    private readonly promptVersionsService: PromptVersionsService,
    private readonly validatePromptVersionUseCase: ValidatePromptVersionUseCase,
    private readonly promptActivateHistoryService: PromptActivateHistoryService,
  ) {}
  async findPromptVersions(params: { name?: string; isBookmarked?: boolean }): Promise<PromptVersions[]> {
    const { name, isBookmarked } = params;
    return this.promptVersionsService.findMany({
      name,
      isBookmarked,
      isTemporary: false,
    });
  }

  async findPromptVersionById(params: { promptVersionId: UniqueEntityId }): Promise<PromptVersions> {
    const { promptVersionId } = params;
    return this.promptVersionsService.getOne({ promptVersionId });
  }

  // 현재 수정중인 임시버전 조회
  @Transactional()
  async getTemporaryPromptVersion(): Promise<PromptVersions> {
    return this.promptVersionsService.getTemporaryOne();
  }

  async findActivePromptVersion(): Promise<PromptVersions | null> {
    return this.promptVersionsService.findActiveOne();
  }

  // 기존 버전을 임시버전으로 불러오기
  // - 기존 버전의 모든 프롬프트를 임시버전으로 복사
  @Transactional()
  async loadExistingPromptVersion(params: { promptVersionId: UniqueEntityId }): Promise<PromptVersions> {
    const { promptVersionId } = params;
    const promptVersion = await this.promptVersionsService.getOne({
      promptVersionId,
    });
    if (promptVersion.isTemporary) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "Cannot load a temporary version");
    }
    const temporaryVersion = await this.promptVersionsService.getTemporaryOne();
    temporaryVersion.clonePrompts(promptVersion);
    await this.promptVersionsService.update(temporaryVersion);
    return temporaryVersion;
  }

  // 임시버전 저장
  @Transactional()
  async saveTemporaryVersion(params: {
    name: string;
    description: string;
    isBookmarked: boolean;
    gptModel: GPTModel;
  }): Promise<PromptVersions> {
    const { name, description, isBookmarked, gptModel } = params;

    const temporaryVersion = await this.promptVersionsService.getTemporaryOne();

    // 모든 톤과 상담사에 대한 프롬프트가 존재하는지 검증
    const validatePromptVersionResult = await this.validatePromptVersionUseCase.execute({
      promptVersion: temporaryVersion,
    });
    if (!validatePromptVersionResult.ok) {
      throw new HttpStatusBasedRpcException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        validatePromptVersionResult.error as string,
      );
    }

    const saveVersionResult = temporaryVersion.saveVersion({
      name,
      description,
      isBookmarked,
      gptModel,
    });
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
    const promptVersion = await this.promptVersionsService.getOne({
      promptVersionId,
    });
    const activeVersions = await this.promptVersionsService.findMany({
      isActive: true,
    });
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
    // 활성화 기록 생성
    await this.promptActivateHistoryService.create({
      promptVersionId: promptVersion.id,
      activatedAt: getNowDayjs(),
    });
    return promptVersion;
  }

  // 버전 수정
  @Transactional()
  async updatePromptVersion(params: {
    promptVersionId: UniqueEntityId;
    name?: string;
    description?: string;
    isBookmarked?: boolean;
    gptModel?: GPTModel;
  }): Promise<PromptVersions> {
    const { promptVersionId, name, description, isBookmarked, gptModel } = params;
    const promptVersion = await this.promptVersionsService.getOne({
      promptVersionId,
    });
    const updateResult = promptVersion.updateBasicInfo({
      name,
      description,
      isBookmarked,
      gptModel,
    });
    if (updateResult.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, updateResult.error as string);
    }
    await this.promptVersionsService.update(promptVersion);
    return promptVersion;
  }

  // 버전 삭제
  @Transactional()
  async deletePromptVersions(params: { promptVersionIds: UniqueEntityId[] }): Promise<void> {
    const { promptVersionIds } = params;
    const promptVersions = await this.promptVersionsService.getMany({
      ids: promptVersionIds,
    });
    for (const promptVersion of promptVersions) {
      const deleteResult = promptVersion.delete();
      if (deleteResult.isFailure) {
        throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, deleteResult.error as string);
      }
    }
    await this.promptVersionsService.updateMany(promptVersions);
  }
}
