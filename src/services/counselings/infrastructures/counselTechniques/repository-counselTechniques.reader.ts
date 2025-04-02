import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { CounselTechniquesCriteriaFindMany } from "~counselings/domains/counselTechniques/counselTechniques.criteria";
import { CounselTechniquesReader } from "~counselings/domains/counselTechniques/counselTechniques.reader";
import { CounselTechniques } from "~counselings/domains/counselTechniques/models/counselTechniques";
import { CounselTechniquesRepository } from "~counselings/infrastructures/counselTechniques/counselTechniques.repository";
import { RepositoryCounselTechniqueCriteriaMapper } from "~counselings/infrastructures/counselTechniques/mappers/repository-counselTechniques-criteria.mapper";

import { Injectable } from "@nestjs/common";

@Injectable()
export class RepositoryCounselTechniquesReader extends CounselTechniquesReader {
  constructor(private readonly counselTechniquesRepository: CounselTechniquesRepository) {
    super();
  }

  override async findOne(props: { counselTechniqueId: UniqueEntityId }): Promise<CounselTechniques | null> {
    return this.counselTechniquesRepository.findByCounselTechniqueId(props.counselTechniqueId);
  }

  override async findMany(props: CounselTechniquesCriteriaFindMany): Promise<CounselTechniques[]> {
    const typeormOptions = RepositoryCounselTechniqueCriteriaMapper.toFindManyOptions(props);
    return this.counselTechniquesRepository.findMany(typeormOptions);
  }
}
