import { CounselTechniquesService } from "~counselings/domains/counsel-techniques/counsel-techniques.service";
import { PersonaPromptsService } from "~counselings/domains/persona-prompts/persona-prompts.service";
import { PromptVersionInfo } from "~counselings/domains/prompt-versions/models/prompt-version.info";
import { PromptVersionsService } from "~counselings/domains/prompt-versions/prompt-versions.service";
import { TonePromptsService } from "~counselings/domains/tonePrompts/tonePrompts.service";
import { AiModel } from "~proto/com/hearlers/v1/model/counsel_prompt_pb";

import { Injectable, Logger } from "@nestjs/common";
import { isDefined } from "~common/shared/utils/validate";
import { CounselTechniqueId } from "~common/shared-kernel/identifiers/counsel-techinque.id";
import { PromptVersionId } from "~common/shared-kernel/identifiers/prompt-version.id";
import { TonePromptId } from "~common/shared-kernel/identifiers/tone-prompt.id";
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
    const newCounselorScopedPrompts = await Promise.all(
      activeVersion.counselorScopedPrompts
        .filter((counselorScopedPrompt) => counselorScopedPrompt.deletedAt === null)
        .map(async (counselorScopedPrompt) => {
          // 원본 PersonaPrompt 조회
          const originalPersonaPrompt = await this.personaPromptsService.getOne({
            personaPromptId: counselorScopedPrompt.personaPromptId,
          });

          // 새로운 PersonaPrompt 생성
          const newPersonaPrompt = await this.personaPromptsService.create({
            counselorId: originalPersonaPrompt.counselorId,
            body: originalPersonaPrompt.body,
          });

          return {
            counselorId: counselorScopedPrompt.counselorId,
            personaPromptId: newPersonaPrompt.id,
          };
        }),
    );

    // ToneScopedPrompts의 TonePrompt와 CounselTechnique들을 새로 생성
    const newToneScopedPrompts = await Promise.all(
      activeVersion.toneScopedPrompts
        .filter((toneScopedPrompt) => toneScopedPrompt.deletedAt === null)
        .map(async (toneScopedPrompt) => {
          // TonePrompt 복사
          let newTonePromptId: TonePromptId | null = null;
          let newFirstCounselTechniqueId: CounselTechniqueId | null = null;

          if (toneScopedPrompt.tonePromptId) {
            const originalTonePrompt = await this.tonePromptsService.getOne({
              tonePromptId: toneScopedPrompt.tonePromptId,
            });

            const newTonePrompt = await this.tonePromptsService.create({
              toneId: originalTonePrompt.toneId,
              body: originalTonePrompt.body,
            });

            newTonePromptId = newTonePrompt.id;
          }

          // CounselTechnique 체인 복사
          if (toneScopedPrompt.firstCounselTechniqueId) {
            const originalTechniques = await this.counselTechniquesService.getOrdered({
              firstCounselTechniqueId: toneScopedPrompt.firstCounselTechniqueId,
            });
            const orderedNewTechniqueIds = [];
            for (const technique of originalTechniques) {
              const newTechnique = await this.counselTechniquesService.create({
                toneId: toneScopedPrompt.toneId,
                name: technique.name,
                temperature: technique.temperature,
                context: technique.context,
                instruction: technique.instruction,
                messageThreshold: technique.messageThreshold,
              });
              orderedNewTechniqueIds.push(newTechnique.id);
            }

            const newTechniques = await this.counselTechniquesService.saveCounselTechniqueSequence({
              originalfirstCounselTechniqueId: orderedNewTechniqueIds[0],
              toneId: toneScopedPrompt.toneId,
              counselTechniqueIds: orderedNewTechniqueIds,
            });

            if (newTechniques.length > 0) {
              newFirstCounselTechniqueId = orderedNewTechniqueIds[0];
            }
          }

          return {
            toneId: toneScopedPrompt.toneId,
            tonePromptId: newTonePromptId,
            firstCounselTechniqueId: newFirstCounselTechniqueId,
          };
        }),
    );

    const newTemporaryVersion = await this.promptVersionsService.createTemporaryPromptVersion({
      name: `임시 버전 (${activeVersion.name} 복사)`,
      description: `현재 수정 중인 임시 버전입니다. (부모 버전: ${activeVersion.name})`,
      counselorScopedPrompts: newCounselorScopedPrompts,
      toneScopedPrompts: newToneScopedPrompts,
      aiModel: activeVersion.aiModel,
    });

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
      counselorScopedPrompts: [],
      toneScopedPrompts: [],
      aiModel: AiModel.GPT_4O,
    });
    return newTemporaryVersion;
  }
}
