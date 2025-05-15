import { CounselTechniques } from "~counselings/domains/counselTechniques/models/counselTechniques";
import { PersonaPrompts } from "~counselings/domains/personaPrompts/models/personaPrompts";
import { PromptActivateHistories } from "~counselings/domains/promptActivateHistory/models/promptActivateHistory";
import { CounselorScopedPrompts } from "~counselings/domains/promptVersions/models/counselorScopedPrompts";
import { PromptVersions } from "~counselings/domains/promptVersions/models/promptVersions";
import { ToneScopedPrompts } from "~counselings/domains/promptVersions/models/toneScopedPrompts";
import { TonePrompts } from "~counselings/domains/tonePrompts/models/tonePrompts";
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
  static toPromptVersionProto(promptVersion: PromptVersions): PromptVersion {
    return create(PromptVersionSchema, {
      id: promptVersion.id.getString(),
      name: promptVersion.name,
      description: promptVersion.description,
      isActive: promptVersion.isActive,
      isTemporary: promptVersion.isTemporary,
      // isBookmarked: promptVersion.isBookmarked,
      counselorScopedPrompts: promptVersion.counselorScopedPrompts.map((counselorScopedPrompt) =>
        SchemaCounselPromptsMapper.toCounselorScopedPromptProto(counselorScopedPrompt),
      ),
      toneScopedPrompts: promptVersion.toneScopedPrompts.map((toneScopedPrompt) => SchemaCounselPromptsMapper.toToneScopedPromptProto(toneScopedPrompt)),
      createdAt: promptVersion.createdAt.toISOString(),
      updatedAt: promptVersion.updatedAt.toISOString(),
      deletedAt: promptVersion.deletedAt ? promptVersion.deletedAt.toISOString() : undefined,
    });
  }

  static toCounselorScopedPromptProto(counselorScopedPrompt: CounselorScopedPrompts): CounselorScopedPrompt {
    return create(CounselorScopedPromptSchema, {
      counselorId: counselorScopedPrompt.counselorId.getString(),
      personaPromptId: counselorScopedPrompt.personaPromptId.getString(),
      createdAt: counselorScopedPrompt.createdAt.toISOString(),
      updatedAt: counselorScopedPrompt.updatedAt.toISOString(),
      deletedAt: counselorScopedPrompt.deletedAt ? counselorScopedPrompt.deletedAt.toISOString() : undefined,
    });
  }

  static toToneScopedPromptProto(toneScopedPrompt: ToneScopedPrompts): ToneScopedPrompt {
    return create(ToneScopedPromptSchema, {
      toneId: toneScopedPrompt.toneId.getString(),
      tonePromptId: toneScopedPrompt.tonePromptId ? toneScopedPrompt.tonePromptId.getString() : undefined,
      firstCounselTechniqueId: toneScopedPrompt.firstCounselTechniqueId ? toneScopedPrompt.firstCounselTechniqueId.getString() : undefined,
      createdAt: toneScopedPrompt.createdAt.toISOString(),
      updatedAt: toneScopedPrompt.updatedAt.toISOString(),
      deletedAt: toneScopedPrompt.deletedAt ? toneScopedPrompt.deletedAt.toISOString() : undefined,
    });
  }

  static toPersonaPromptProto(personaPrompt: PersonaPrompts): PersonaPrompt {
    return create(PersonaPromptSchema, {
      id: personaPrompt.id.getString(),
      body: personaPrompt.body,
      counselorId: personaPrompt.counselorId.getString(),
      createdAt: personaPrompt.createdAt.toISOString(),
      updatedAt: personaPrompt.updatedAt.toISOString(),
      deletedAt: personaPrompt.deletedAt ? personaPrompt.deletedAt.toISOString() : undefined,
    });
  }

  static toTonePromptProto(tonePrompt: TonePrompts): TonePrompt {
    return create(TonePromptSchema, {
      id: tonePrompt.id.getString(),
      body: tonePrompt.body,
      toneId: tonePrompt.toneId.getString(),
      createdAt: tonePrompt.createdAt.toISOString(),
      updatedAt: tonePrompt.updatedAt.toISOString(),
      deletedAt: tonePrompt.deletedAt ? tonePrompt.deletedAt.toISOString() : undefined,
    });
  }

  static toCounselTechniqueProto(counselTechnique: CounselTechniques): CounselTechnique {
    return create(CounselTechniqueSchema, {
      id: counselTechnique.id.getString(),
      name: counselTechnique.name,
      toneId: counselTechnique.toneId.getString(),
      context: counselTechnique.context,
      instruction: counselTechnique.instruction,
      messageThreshold: counselTechnique.messageThreshold,
      isTemporary: counselTechnique.isTemporary,
      nextCounselTechniqueId: counselTechnique.nextTechniqueId ? counselTechnique.nextTechniqueId.getString() : undefined,
      createdAt: counselTechnique.createdAt.toISOString(),
      updatedAt: counselTechnique.updatedAt.toISOString(),
      deletedAt: counselTechnique.deletedAt ? counselTechnique.deletedAt.toISOString() : undefined,
    });
  }

  // PromptActivateHistory
  static toPromptActivateHistoryProto(promptActivateHistory: PromptActivateHistories): PromptActivateHistory {
    return create(PromptActivateHistorySchema, {
      id: promptActivateHistory.id.getString(),
      promptVersionId: promptActivateHistory.promptVersionId.getString(),
      activatedAt: promptActivateHistory.activatedAt.toISOString(),
      createdAt: promptActivateHistory.createdAt.toISOString(),
      updatedAt: promptActivateHistory.updatedAt.toISOString(),
      deletedAt: promptActivateHistory.deletedAt ? promptActivateHistory.deletedAt.toISOString() : undefined,
    });
  }
}
