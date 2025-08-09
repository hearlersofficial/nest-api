import { CounselTechniques } from "~counselings/domains/counselTechniques/models/counselTechniques";

import { Dayjs } from "dayjs";

export class CounselTechniqueInfo {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly temperature: number,
    public readonly toneId: string,
    public readonly context: string,
    public readonly instruction: string,
    public readonly messageThreshold: number,
    public readonly nextTechniqueId: string | null,
    public readonly isTemporary: boolean,
    public readonly createdAt: Dayjs,
    public readonly updatedAt: Dayjs,
    public readonly deletedAt: Dayjs | null,
  ) {}

  static fromDomain(counselTechnique: CounselTechniques): CounselTechniqueInfo {
    return new CounselTechniqueInfo(
      counselTechnique.id.getString(),
      counselTechnique.name,
      counselTechnique.temperature,
      counselTechnique.toneId.getString(),
      counselTechnique.context,
      counselTechnique.instruction,
      counselTechnique.messageThreshold,
      counselTechnique.nextTechniqueId ? counselTechnique.nextTechniqueId.getString() : null,
      counselTechnique.isTemporary,
      counselTechnique.createdAt,
      counselTechnique.updatedAt,
      counselTechnique.deletedAt,
    );
  }

  static fromDomainArray(counselTechniques: CounselTechniques[]): CounselTechniqueInfo[] {
    return counselTechniques.map((technique) => CounselTechniqueInfo.fromDomain(technique));
  }
}
