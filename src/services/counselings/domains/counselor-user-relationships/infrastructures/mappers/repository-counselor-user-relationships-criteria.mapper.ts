import * as CounselorUserRelationshipsCriteria from "~counselings/domains/counselor-user-relationships/counselor-user-relationship.criteria";

import { CounselorUserRelationshipsEntity } from "~common/system/persistences/entities/counsels/counselor-user-relationships.entity";
import { FindManyOptions, FindOneOptions, FindOptionsWhere } from "typeorm";

export class RepositoryCounselorUserRelationshipsCriteriaMapper {
  static toFindOneOptions(
    criteria: CounselorUserRelationshipsCriteria.FindOneOptions,
  ): FindOneOptions<CounselorUserRelationshipsEntity> {
    const where: FindOptionsWhere<CounselorUserRelationshipsEntity> = {};

    if (criteria.counselorId) {
      where.counselorId = criteria.counselorId.getString();
    }
    if (criteria.userId) {
      where.userId = criteria.userId.getString();
    }

    return { where };
  }

  static toFindManyOptions(
    criteria: CounselorUserRelationshipsCriteria.FindManyOptions,
  ): FindManyOptions<CounselorUserRelationshipsEntity> {
    const where: FindOptionsWhere<CounselorUserRelationshipsEntity> = {};

    if (criteria.userId) {
      where.userId = criteria.userId.getString();
    }

    return { where };
  }
}
