import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { CounselsCriteriaFindMany } from "~counselings/domains/counsels/counsels.criteria";
import { CounselsReader } from "~counselings/domains/counsels/counsels.reader";
import { Counsels } from "~counselings/domains/counsels/models/counsels";
import { CounselsRepository } from "~counselings/infrastructures/counsels/counsels.repository";
import { RepositoryCounselCriteriaMapper } from "~counselings/infrastructures/counsels/mappers/repository-counsels-criteria.mapper";

import { Injectable } from "@nestjs/common";

@Injectable()
export class RepositoryCounselsReader extends CounselsReader {
  constructor(private readonly counselsRepository: CounselsRepository) {
    super();
  }

  override async findOne(props: { counselId: UniqueEntityId }): Promise<Counsels | null> {
    return this.counselsRepository.findByCounselId(props.counselId);
  }

  override async findMany(props: CounselsCriteriaFindMany): Promise<Counsels[]> {
    const typeormOptions = RepositoryCounselCriteriaMapper.toFindManyOptions(props);
    return this.counselsRepository.findMany(typeormOptions);
  }
}
