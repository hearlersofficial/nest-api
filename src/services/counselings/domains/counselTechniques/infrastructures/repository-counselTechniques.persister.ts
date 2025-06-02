import { CounselTechniquesPersister } from "~counselings/domains/counselTechniques/counselTechniques.persister";
import { CounselTechniquesRepository } from "~counselings/domains/counselTechniques/infrastructures/counselTechniques.repository";
import {
  CounselTechniques,
  CounselTechniquesNewProps,
} from "~counselings/domains/counselTechniques/models/counselTechniques";

import { HttpStatus, Injectable } from "@nestjs/common";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";

@Injectable()
export class RepositoryCounselTechniquesPersister extends CounselTechniquesPersister {
  constructor(private readonly counselTechniquesRepository: CounselTechniquesRepository) {
    super();
  }

  override async create(newProps: CounselTechniquesNewProps): Promise<CounselTechniques> {
    const counselTechniqueResult = CounselTechniques.createNew(newProps);
    if (counselTechniqueResult.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, counselTechniqueResult.error as string);
    }
    return this.counselTechniquesRepository.save(counselTechniqueResult.value);
  }

  override async update(counselTechnique: CounselTechniques): Promise<CounselTechniques> {
    return this.counselTechniquesRepository.save(counselTechnique);
  }

  override async updateMany(counselTechniques: CounselTechniques[]): Promise<CounselTechniques[]> {
    return this.counselTechniquesRepository.save(counselTechniques);
  }
}
