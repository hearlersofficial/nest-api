import * as CounselorUserRelationshipsCriteria from "~counselings/domains/counselor-user-relationships/counselor-user-relationship.criteria";
import { CounselorUserRelationshipsReader } from "~counselings/domains/counselor-user-relationships/counselor-user-relationships.reader";
import { CounselorUserRelationshipsRepository } from "~counselings/domains/counselor-user-relationships/infrastructures/counselor-user-relationships.repository";
import { RepositoryCounselorUserRelationshipsCriteriaMapper } from "~counselings/domains/counselor-user-relationships/infrastructures/mappers/repository-counselor-user-relationships-criteria.mapper";
import { CounselorUserRelationships } from "~counselings/domains/counselor-user-relationships/models/counselor-user-relationships";

import { Injectable } from "@nestjs/common";

@Injectable()
export class RepositoryCounselorUserRelationshipsReader extends CounselorUserRelationshipsReader {
  constructor(private readonly counselorUserRelationshipsRepository: CounselorUserRelationshipsRepository) {
    super();
  }

  override async findOne(props: {
    uniqueCriteria: CounselorUserRelationshipsCriteria.UniqueKey;
    options?: CounselorUserRelationshipsCriteria.FindOneOptions;
  }): Promise<CounselorUserRelationships | null> {
    const { uniqueCriteria, options } = props;
    const typeormOptions = options
      ? RepositoryCounselorUserRelationshipsCriteriaMapper.toFindOneOptions(options)
      : undefined;

    if (uniqueCriteria.type === "counselorUserRelationship") {
      return this.counselorUserRelationshipsRepository.findByRelationshipId(uniqueCriteria.id, typeormOptions);
    }
    if (uniqueCriteria.type === "userAndCounselor") {
      return this.counselorUserRelationshipsRepository.findByUserAndCounselorId(
        uniqueCriteria.userId,
        uniqueCriteria.counselorId,
        typeormOptions,
      );
    }
    return null;
  }

  override async findMany(
    props: CounselorUserRelationshipsCriteria.FindManyOptions,
  ): Promise<CounselorUserRelationships[]> {
    const typeormOptions = RepositoryCounselorUserRelationshipsCriteriaMapper.toFindManyOptions(props);
    return this.counselorUserRelationshipsRepository.findMany(typeormOptions);
  }
}
