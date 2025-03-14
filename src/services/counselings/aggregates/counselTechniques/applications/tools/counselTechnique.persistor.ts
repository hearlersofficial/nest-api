import { CounselTechniques } from "~counselings/aggregates/counselTechniques/domain/counselTechniques";
import {
  COUNSEL_TECHNIQUE_REPOSITORY,
  CounselTechniquesRepositoryPort,
} from "~counselings/aggregates/counselTechniques/infrastructures/counselTechniques.repository.port";

import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class CounselTechniquePersistor {
  constructor(
    @Inject(COUNSEL_TECHNIQUE_REPOSITORY)
    private readonly counselTechniqueRepository: CounselTechniquesRepositoryPort,
  ) {}

  async create(counselTechnique: CounselTechniques): Promise<CounselTechniques> {
    const createdCounselTechnique = await this.counselTechniqueRepository.create(counselTechnique);
    return createdCounselTechnique;
  }

  async update(counselTechnique: CounselTechniques): Promise<CounselTechniques> {
    const updatedCounselTechnique = await this.counselTechniqueRepository.update(counselTechnique);
    return updatedCounselTechnique;
  }

  async updateMany(counselTechniques: CounselTechniques[]): Promise<CounselTechniques[]> {
    const updatedCounselTechnqiues = await this.counselTechniqueRepository.updateMany(counselTechniques);
    return updatedCounselTechnqiues;
  }
}
