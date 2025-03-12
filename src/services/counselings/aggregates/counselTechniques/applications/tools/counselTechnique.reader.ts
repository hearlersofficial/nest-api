import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { CounselTechniques } from "~counselings/aggregates/counselTechniques/domain/counselTechniques";
import {
  COUNSEL_TECHNIQUE_REPOSITORY,
  CounselTechniquesRepositoryPort,
} from "~counselings/aggregates/counselTechniques/infrastructures/counselTechniques.repository.port";
import { CounselTechniqueStage } from "~proto/com/hearlers/v1/model/counsel_pb";

import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class CounselTechniqueReader {
  constructor(
    @Inject(COUNSEL_TECHNIQUE_REPOSITORY)
    private readonly counselTechniqueRepository: CounselTechniquesRepositoryPort,
  ) {}

  async findOne(counselTechniqueId: UniqueEntityId): Promise<CounselTechniques | null> {
    const counselTechnique = await this.counselTechniqueRepository.findOne(counselTechniqueId);
    return counselTechnique;
  }

  async findFirst(props: { stage: CounselTechniqueStage; toneId?: UniqueEntityId }): Promise<CounselTechniques | null> {
    const counselTechnique = await this.counselTechniqueRepository.findFirst(props);
    return counselTechnique;
  }

  async findAll(): Promise<CounselTechniques[]> {
    const counselTechniques = await this.counselTechniqueRepository.findAll();
    return counselTechniques;
  }

  async findMany(props: {
    ids?: UniqueEntityId[];
    name?: string;
    toneId?: UniqueEntityId;
    counselTechniqueStage?: CounselTechniqueStage;
  }): Promise<CounselTechniques[]> {
    const counselTechniques = await this.counselTechniqueRepository.findMany(props);
    return counselTechniques;
  }
}
