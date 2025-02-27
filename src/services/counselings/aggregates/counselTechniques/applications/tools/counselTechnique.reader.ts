import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { CounselTechniques } from "~counselings/aggregates/counselTechniques/domain/counselTechniques";
import {
  COUNSEL_TECHNIQUE_REPOSITORY,
  CounselTechniquesRepositoryPort,
} from "~counselings/aggregates/counselTechniques/infrastructures/counselTechniques.repository.port";

import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class CounselTechniqueReader {
  constructor(
    @Inject(COUNSEL_TECHNIQUE_REPOSITORY)
    private readonly counselTechniqueRepository: CounselTechniquesRepositoryPort,
  ) {}

  async findOne(counselTechniqueId: UniqueEntityId): Promise<CounselTechniques> {
    const counselTechnique = await this.counselTechniqueRepository.findOne(counselTechniqueId);
    return counselTechnique;
  }

  async findAll(): Promise<CounselTechniques[]> {
    const counselTechniques = await this.counselTechniqueRepository.findAll();
    return counselTechniques;
  }

  async findMany(props: { name?: string }): Promise<CounselTechniques[]> {
    const counselTechniques = await this.counselTechniqueRepository.findMany(props);
    return counselTechniques;
  }
}
