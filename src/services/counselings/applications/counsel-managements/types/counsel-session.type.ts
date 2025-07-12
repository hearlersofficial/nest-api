import { CompressedContextInfo } from "~counselings/domains/compressedContext/models/compressedContext.info";
import { CounselMessageInfo } from "~counselings/domains/counselMessages/models/counselMessage.info";
import { CounselorsInfo } from "~counselings/domains/counselors/models/counselors.info";
import { CounselInfo } from "~counselings/domains/counsels/models/counsel.info";
import { CounselTechniqueInfo } from "~counselings/domains/counselTechniques/models/counselTechnique.info";
import { PromptVersionInfo } from "~counselings/domains/promptVersions/models/promptVersion.info";

import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";

export type CounselSessionData = {
  counsel: CounselInfo;
  counselor: CounselorsInfo;
  messages: CounselMessageInfo[];
  promptVersion: PromptVersionInfo;
  currentTechnique: CounselTechniqueInfo;
  compressedContexts: CompressedContextInfo[];
};

export type CounselorScopedPromptData = {
  counselorId: string;
  personaPromptId: string;
};

export type ToneScopedPromptData = {
  toneId: string;
  tonePromptId: string;
  firstCounselTechniqueId: string;
};

export type SessionContext = {
  counselId: UniqueEntityId;
  userId: UniqueEntityId;
  counselorId: UniqueEntityId;
  promptVersionId: UniqueEntityId;
  currentTechniqueId: UniqueEntityId;
};
