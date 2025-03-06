import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { CounselTechniques } from "~counselings/aggregates/counselTechniques/domain/counselTechniques";
import { CounselTechniqueStage } from "~proto/com/hearlers/v1/model/counsel_pb";

export const COUNSEL_TECHNIQUE_REPOSITORY = Symbol("COUNSEL_TECHNIQUE_REPOSITORY");

export interface CounselTechniquesRepositoryPort {
  create(counselTechnique: CounselTechniques): Promise<CounselTechniques>;
  update(counselTechnique: CounselTechniques): Promise<CounselTechniques>;
  findOne(counselTechniqueId: UniqueEntityId): Promise<CounselTechniques | null>;
  findFirst(props: FindFirstPropsInCounselTechniquesRepository): Promise<CounselTechniques | null>;
  findAll(): Promise<CounselTechniques[]>;
  findMany(props: FindManyPropsInCounselTechniquesRepository): Promise<CounselTechniques[]>;
}

export interface FindManyPropsInCounselTechniquesRepository {
  name?: string;
}

export interface FindFirstPropsInCounselTechniquesRepository {
  stage: CounselTechniqueStage;
  toneId?: UniqueEntityId;
}
