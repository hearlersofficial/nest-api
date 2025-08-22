import { CounselTechniqueInfo } from "~counselings/domains/counsel-techniques/models/counsel-technique.info";
import { PersonaPromptInfo } from "~counselings/domains/persona-prompts/models/persona-prompt.info";
import { CounselorScopedPromptInfo } from "~counselings/domains/prompt-versions/models/counselor-scoped-prompt.info";
import { PromptVersionInfo } from "~counselings/domains/prompt-versions/models/prompt-version.info";
import { ToneScopedPromptInfo } from "~counselings/domains/prompt-versions/models/tone-scoped-prompt.info";
import { PromptActivateHistoryInfo } from "~counselings/domains/promptActivateHistory/models/promptActivateHistory.info";
import { TonePromptInfo } from "~counselings/domains/tone-prompts/models/tone-prompt.info";
import {
  CounselorScopedPrompt,
  CounselorScopedPromptSchema,
  CounselTechnique,
  CounselTechniqueSchema,
  PersonaPrompt,
  PersonaPromptSchema,
  PromptActivateHistory,
  PromptActivateHistorySchema,
  PromptVersion,
  PromptVersionSchema,
  TonePrompt,
  TonePromptSchema,
  ToneScopedPrompt,
  ToneScopedPromptSchema,
} from "~proto/com/hearlers/v1/model/counsel_prompt_pb";

import { create } from "@bufbuild/protobuf";

export class SchemaCounselPromptsMapper {
  static toPromptVersionProto(promptVersion: null): null;
  static toPromptVersionProto(promptVersion: PromptVersionInfo): PromptVersion;
  static toPromptVersionProto(promptVersion: PromptVersionInfo | null): PromptVersion | null;
  static toPromptVersionProto(promptVersion: PromptVersionInfo | null): PromptVersion | null {
    if (!promptVersion) {
      return null;
    }

    return create(PromptVersionSchema, {
      id: promptVersion.id.getString(),
      name: promptVersion.name,
      description: promptVersion.description,
      isActive: promptVersion.isActive,
      isTemporary: promptVersion.isTemporary,
      isBookmarked: promptVersion.isBookmarked,
      aiModel: promptVersion.aiModel,
      counselorScopedPrompts: promptVersion.counselorScopedPrompts.map((counselorScopedPrompt) =>
        SchemaCounselPromptsMapper.toCounselorScopedPromptProto(counselorScopedPrompt),
      ),
      toneScopedPrompts: promptVersion.toneScopedPrompts.map((toneScopedPrompt) =>
        SchemaCounselPromptsMapper.toToneScopedPromptProto(toneScopedPrompt),
      ),
      createdAt: promptVersion.createdAt.toISOString(),
      updatedAt: promptVersion.updatedAt.toISOString(),
      deletedAt: promptVersion.deletedAt ? promptVersion.deletedAt.toISOString() : undefined,
    });
  }

  static toCounselorScopedPromptProto(counselorScopedPrompt: null): null;
  static toCounselorScopedPromptProto(counselorScopedPrompt: CounselorScopedPromptInfo): CounselorScopedPrompt;
  static toCounselorScopedPromptProto(
    counselorScopedPrompt: CounselorScopedPromptInfo | null,
  ): CounselorScopedPrompt | null;
  static toCounselorScopedPromptProto(
    counselorScopedPrompt: CounselorScopedPromptInfo | null,
  ): CounselorScopedPrompt | null {
    if (!counselorScopedPrompt) {
      return null;
    }
    return create(CounselorScopedPromptSchema, {
      counselorId: counselorScopedPrompt.counselorId.getString(),
      personaPromptId: counselorScopedPrompt.personaPromptId.getString(),
      createdAt: counselorScopedPrompt.createdAt.toISOString(),
      updatedAt: counselorScopedPrompt.updatedAt.toISOString(),
      deletedAt: counselorScopedPrompt.deletedAt ? counselorScopedPrompt.deletedAt.toISOString() : undefined,
    });
  }

  static toToneScopedPromptProto(toneScopedPrompt: ToneScopedPromptInfo): ToneScopedPrompt;
  static toToneScopedPromptProto(toneScopedPrompt: ToneScopedPromptInfo | null): ToneScopedPrompt | null;
  static toToneScopedPromptProto(toneScopedPrompt: ToneScopedPromptInfo | null): ToneScopedPrompt | null {
    if (!toneScopedPrompt) {
      return null;
    }
    return create(ToneScopedPromptSchema, {
      toneId: toneScopedPrompt.toneId.getString(),
      tonePromptId: toneScopedPrompt.tonePromptId ? toneScopedPrompt.tonePromptId.getString() : undefined,
      firstCounselTechniqueId: toneScopedPrompt.firstCounselTechniqueId
        ? toneScopedPrompt.firstCounselTechniqueId.getString()
        : undefined,
      createdAt: toneScopedPrompt.createdAt.toISOString(),
      updatedAt: toneScopedPrompt.updatedAt.toISOString(),
      deletedAt: toneScopedPrompt.deletedAt ? toneScopedPrompt.deletedAt.toISOString() : undefined,
    });
  }

  static toPersonaPromptProto(personaPrompt: null): null;
  static toPersonaPromptProto(personaPrompt: PersonaPromptInfo): PersonaPrompt;
  static toPersonaPromptProto(personaPrompt: PersonaPromptInfo | null): PersonaPrompt | null;
  static toPersonaPromptProto(personaPrompt: PersonaPromptInfo | null): PersonaPrompt | null {
    if (!personaPrompt) {
      return null;
    }
    return create(PersonaPromptSchema, {
      id: personaPrompt.id.getString(),
      body: personaPrompt.body,
      counselorId: personaPrompt.counselorId.getString(),
      createdAt: personaPrompt.createdAt.toISOString(),
      updatedAt: personaPrompt.updatedAt.toISOString(),
      deletedAt: personaPrompt.deletedAt ? personaPrompt.deletedAt.toISOString() : undefined,
    });
  }

  static toTonePromptProto(tonePrompt: null): null;
  static toTonePromptProto(tonePrompt: TonePromptInfo): TonePrompt;
  static toTonePromptProto(tonePrompt: TonePromptInfo | null): TonePrompt | null;
  static toTonePromptProto(tonePrompt: TonePromptInfo | null): TonePrompt | null {
    if (!tonePrompt) {
      return null;
    }
    return create(TonePromptSchema, {
      id: tonePrompt.id.getString(),
      body: tonePrompt.body,
      toneId: tonePrompt.toneId.getString(),
      createdAt: tonePrompt.createdAt.toISOString(),
      updatedAt: tonePrompt.updatedAt.toISOString(),
      deletedAt: tonePrompt.deletedAt ? tonePrompt.deletedAt.toISOString() : undefined,
    });
  }

  static toCounselTechniqueProto(counselTechnique: null): null;
  static toCounselTechniqueProto(counselTechnique: CounselTechniqueInfo): CounselTechnique;
  static toCounselTechniqueProto(counselTechnique: CounselTechniqueInfo | null): CounselTechnique | null;
  static toCounselTechniqueProto(counselTechnique: CounselTechniqueInfo | null): CounselTechnique | null {
    if (!counselTechnique) {
      return null;
    }
    return create(CounselTechniqueSchema, {
      id: counselTechnique.id.getString(),
      name: counselTechnique.name,
      toneId: counselTechnique.toneId.getString(),
      context: counselTechnique.context,
      instruction: counselTechnique.instruction,
      messageThreshold: counselTechnique.messageThreshold,
      isTemporary: counselTechnique.isTemporary,
      nextCounselTechniqueId: counselTechnique.nextTechniqueId
        ? counselTechnique.nextTechniqueId.getString()
        : undefined,
      temperature: counselTechnique.temperature,
      createdAt: counselTechnique.createdAt.toISOString(),
      updatedAt: counselTechnique.updatedAt.toISOString(),
      deletedAt: counselTechnique.deletedAt ? counselTechnique.deletedAt.toISOString() : undefined,
    });
  }

  // PromptActivateHistory
  static toPromptActivateHistoryProto(promptActivateHistory: null): null;
  static toPromptActivateHistoryProto(promptActivateHistory: PromptActivateHistoryInfo): PromptActivateHistory;
  static toPromptActivateHistoryProto(
    promptActivateHistory: PromptActivateHistoryInfo | null,
  ): PromptActivateHistory | null;
  static toPromptActivateHistoryProto(
    promptActivateHistory: PromptActivateHistoryInfo | null,
  ): PromptActivateHistory | null {
    if (!promptActivateHistory) {
      return null;
    }
    return create(PromptActivateHistorySchema, {
      id: promptActivateHistory.id,
      promptVersionId: promptActivateHistory.promptVersionId,
      activatedAt: promptActivateHistory.activatedAt.toISOString(),
      createdAt: promptActivateHistory.createdAt.toISOString(),
      updatedAt: promptActivateHistory.updatedAt.toISOString(),
      deletedAt: promptActivateHistory.deletedAt ? promptActivateHistory.deletedAt.toISOString() : undefined,
    });
  }
}
