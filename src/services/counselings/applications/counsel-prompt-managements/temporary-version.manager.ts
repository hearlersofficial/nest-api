import { CounselTechniquesService } from "~counselings/domains/counsel-techniques/counsel-techniques.service";
import { PersonaPromptsService } from "~counselings/domains/persona-prompts/persona-prompts.service";
import { PromptVersionInfo } from "~counselings/domains/prompt-versions/models/prompt-version.info";
import { PromptVersionsService } from "~counselings/domains/prompt-versions/prompt-versions.service";
import { TonePromptsService } from "~counselings/domains/tone-prompts/tone-prompts.service";
import { AiModel } from "~proto/com/hearlers/v1/model/counsel_prompt_pb";

import { Injectable, Logger } from "@nestjs/common";
import { isDefined } from "~common/shared/utils/validate";
import { PromptVersionId } from "~common/shared-kernel/identifiers/prompt-version.id";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class TemporaryVersionManager {
  constructor(
    private readonly promptVersionsService: PromptVersionsService,
    private readonly personaPromptsService: PersonaPromptsService,
    private readonly tonePromptsService: TonePromptsService,
    private readonly counselTechniquesService: CounselTechniquesService,
  ) {}

  private readonly logger = new Logger(TemporaryVersionManager.name);
  /**
   * 임시 프롬프트 버전을 조회하거나 생성합니다.
   * 활성 버전이 있을 경우 연관된 객체들을 새로 생성하여 복사합니다.
   */
  @Transactional()
  async getOrCreateTemporaryOne(): Promise<PromptVersionInfo> {
    try {
      const existingTemporary = await this.promptVersionsService.getTemporaryOne();
      return existingTemporary;
    } catch (error) {
      // 임시 버전이 없다면 새로 생성
      const activeVersion = await this.promptVersionsService.getActiveOne().catch(() => null);

      if (activeVersion) {
        // 활성 버전이 있다면 복사된 값들로 새 임시 버전 생성
        return await this.createTemporaryVersionFromActive(activeVersion);
      } else {
        // 활성 버전이 없다면 빈 값으로 새 임시 버전 생성
        return await this.createEmptyTemporaryVersion();
      }
    }
  }

  @Transactional()
  async loadExistingPromptVersion(promptVersionId: PromptVersionId): Promise<PromptVersionInfo> {
    const sourceVersion = await this.promptVersionsService.getOne({ promptVersionId });
    const existingTemporary = await this.promptVersionsService.getTemporaryOne();
    // 임시 버전이 있다면 임시 버전 삭제
    if (isDefined(existingTemporary)) {
      await this.promptVersionsService.deletePromptVersions({ promptVersionIds: [existingTemporary.id] });
    }
    const clonedPromptVersion = await this.promptVersionsService.createTemporaryPromptVersion(sourceVersion);
    return clonedPromptVersion;
  }

  /**
   * 활성 버전을 복사하여 새로운 임시 버전을 생성합니다.
   */
  @Transactional()
  private async createTemporaryVersionFromActive(activeVersion: PromptVersionInfo): Promise<PromptVersionInfo> {
    // CounselorScopedPrompts의 PersonaPrompt들을 새로 생성
    const newTemporaryVersion = await this.promptVersionsService.createTemporaryPromptVersion({
      name: `임시 버전 (${activeVersion.name} 복사)`,
      description: `현재 수정 중인 임시 버전입니다. (부모 버전: ${activeVersion.name})`,
      aiModel: activeVersion.aiModel,
    });

    const activePersonaPrompts = await this.personaPromptsService.findMany({
      promptVersionId: activeVersion.id,
    });
    const activeTonePrompts = await this.tonePromptsService.findMany({
      promptVersionId: activeVersion.id,
    });
    const activeCounselTechniques = await this.counselTechniquesService.findMany({
      promptVersionId: activeVersion.id,
    });

    Promise.all([
      ...activePersonaPrompts.map(async (personaPrompt) => {
        return this.personaPromptsService.create({
          promptVersionId: newTemporaryVersion.id,
          counselorId: personaPrompt.counselorId,
          body: personaPrompt.body,
        });
      }),
      ...activeTonePrompts.map(async (tonePrompt) => {
        return this.tonePromptsService.create({
          promptVersionId: newTemporaryVersion.id,
          toneId: tonePrompt.toneId,
          body: tonePrompt.body,
        });
      }),
      ...activeCounselTechniques.map(async (counselTechnique) => {
        return this.counselTechniquesService.create({
          promptVersionId: newTemporaryVersion.id,
          toneId: counselTechnique.toneId,
          name: counselTechnique.name,
          temperature: counselTechnique.temperature,
          context: counselTechnique.context,
          instruction: counselTechnique.instruction,
          messageThreshold: counselTechnique.messageThreshold,
        });
      }),
    ]);

    return newTemporaryVersion;
  }

  /**
   * 빈 값으로 새로운 임시 버전을 생성합니다.
   */
  @Transactional()
  private async createEmptyTemporaryVersion(): Promise<PromptVersionInfo> {
    const newTemporaryVersion = await this.promptVersionsService.createTemporaryPromptVersion({
      name: "임시 버전",
      description: "현재 수정 중인 임시 버전입니다. (부모 버전: 없음)",
      aiModel: AiModel.GPT_4O,
    });
    return newTemporaryVersion;
  }
}
