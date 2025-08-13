import { CounselTechniquesCriteriaFindMany } from "~counselings/domains/counselTechniques/counselTechniques.criteria";
import { CounselTechniquesReader } from "~counselings/domains/counselTechniques/counselTechniques.reader";
import { CounselTechniquesRepository } from "~counselings/domains/counselTechniques/infrastructures/counselTechniques.repository";
import { RepositoryCounselTechniqueCriteriaMapper } from "~counselings/domains/counselTechniques/infrastructures/mappers/repository-counselTechniques-criteria.mapper";
import { CounselTechniques } from "~counselings/domains/counselTechniques/models/counselTechniques";

import { Injectable } from "@nestjs/common";
import { CounselTechniqueId } from "~common/shared-kernel/identifiers/counsel-techinque.id";

@Injectable()
export class RepositoryCounselTechniquesReader extends CounselTechniquesReader {
  constructor(private readonly counselTechniquesRepository: CounselTechniquesRepository) {
    super();
  }

  override async findOne(props: { counselTechniqueId: CounselTechniqueId }): Promise<CounselTechniques | null> {
    return this.counselTechniquesRepository.findByCounselTechniqueId(props.counselTechniqueId);
  }

  override async findMany(props: CounselTechniquesCriteriaFindMany): Promise<CounselTechniques[]> {
    const typeormOptions = RepositoryCounselTechniqueCriteriaMapper.toFindManyOptions(props);
    return this.counselTechniquesRepository.findMany(typeormOptions);
  }
}
