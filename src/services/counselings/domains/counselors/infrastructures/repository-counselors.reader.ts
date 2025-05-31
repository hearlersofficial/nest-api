import { CounselorsCriteriaFindMany } from "~counselings/domains/counselors/counselors.criteria";
import { CounselorsReader } from "~counselings/domains/counselors/counselors.reader";
import { RepositoryCounselorCriteriaMapper } from "~counselings/domains/counselors/infrastructures/mappers/repository-counselors-criteria.mapper";
import { Counselors } from "~counselings/domains/counselors/models/counselors";
import { CounselorsRepository } from "~counselings/infrastructures/counselors/counselors.repository";

import { Injectable } from "@nestjs/common";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";

@Injectable()
export class RepositoryCounselorsReader extends CounselorsReader {
  constructor(private readonly counselorsRepository: CounselorsRepository) {
    super();
  }

  override async findOne(props: { counselorId: UniqueEntityId }): Promise<Counselors | null> {
    return this.counselorsRepository.findByCounselorId(props.counselorId);
  }

  override async findMany(props: CounselorsCriteriaFindMany): Promise<Counselors[]> {
    const typeormOptions = RepositoryCounselorCriteriaMapper.toFindManyOptions(props);
    return this.counselorsRepository.findMany(typeormOptions);
  }
}
