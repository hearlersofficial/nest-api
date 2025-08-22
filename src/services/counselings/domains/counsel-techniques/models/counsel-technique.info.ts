import { CounselTechniques } from "~counselings/domains/counsel-techniques/models/counsel-techniques";

import { CounselTechniqueId } from "~common/shared-kernel/identifiers/counsel-techinque.id";
import { PromptVersionId } from "~common/shared-kernel/identifiers/prompt-version.id";
import { ToneId } from "~common/shared-kernel/identifiers/tone.id";
import { Dayjs } from "dayjs";

export class CounselTechniqueInfo {
  constructor(
    public readonly id: CounselTechniqueId,
    public readonly promptVersionId: PromptVersionId,
    public readonly name: string,
    public readonly temperature: number,
    public readonly toneId: ToneId,
    public readonly context: string,
    public readonly instruction: string,
    public readonly messageThreshold: number,
    public readonly isStartTechnique: boolean,
    public readonly createdAt: Dayjs,
    public readonly updatedAt: Dayjs,
    public readonly deletedAt: Dayjs | null,
  ) {}

  static fromDomain(counselTechnique: CounselTechniques): CounselTechniqueInfo {
    return new CounselTechniqueInfo(
      counselTechnique.id,
      counselTechnique.promptVersionId,
      counselTechnique.name,
      counselTechnique.temperature,
      counselTechnique.toneId,
      counselTechnique.context,
      counselTechnique.instruction,
      counselTechnique.messageThreshold,
      counselTechnique.isStartTechnique,
      counselTechnique.createdAt,
      counselTechnique.updatedAt,
      counselTechnique.deletedAt,
    );
  }

  static fromDomainArray(counselTechniques: CounselTechniques[]): CounselTechniqueInfo[] {
    return counselTechniques.map((technique) => CounselTechniqueInfo.fromDomain(technique));
  }
}
