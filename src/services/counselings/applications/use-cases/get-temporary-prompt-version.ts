import { UseCase } from "~shared/core/applications/UseCase";
import {
  GetTemporaryPromptVersionUseCaseRequest,
  GetTemporaryPromptVersionUseCaseResponse,
} from "~counselings/applications/use-cases/dtos/get-temporary-prompt-version.dto";
import { PromptVersionsService } from "~counselings/domains/promptVersions/promptVersions.service";

import { Injectable } from "@nestjs/common";

@Injectable()
export class GetTemporaryPromptVersionUseCase implements UseCase<GetTemporaryPromptVersionUseCaseRequest, GetTemporaryPromptVersionUseCaseResponse> {
  constructor(private readonly promptVersionsService: PromptVersionsService) {}

  async execute(request: GetTemporaryPromptVersionUseCaseRequest): Promise<GetTemporaryPromptVersionUseCaseResponse> {
    const existingTemporaryVersions = await this.promptVersionsService.findMany({ isTemporary: true });
    const {} = request;
    if (existingTemporaryVersions.length > 0) {
      return {
        ok: true,
        temporaryVersion: existingTemporaryVersions[0],
      };
    }

    // 수정중인 임시버전이 없을 경우 새롭게 생성
    const newTemporaryVersion = await this.promptVersionsService.create({});

    // 활성화 버전이 있을 경우 해당 내용 복사
    const activeVersion = await this.promptVersionsService.findMany({ isActive: true });
    if (activeVersion.length > 0) {
      newTemporaryVersion.clonePrompts(activeVersion[0]);
      await this.promptVersionsService.update(newTemporaryVersion);
    }
    return {
      ok: true,
      temporaryVersion: newTemporaryVersion,
    };
  }
}
