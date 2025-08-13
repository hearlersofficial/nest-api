import {
  CompressedContextCriteriaFindMany,
  CounselMessagesCriteriaFindMany,
  CounselsCriteriaFindMany,
} from "~counselings/domains/counsels/counsels.criteria";

import { isDefined } from "~common/shared/utils/validate";
import { CompressedContextsEntity } from "~common/system/persistences/entities/counsels/CompressedContexts.entity";
import { CounselMessagesEntity } from "~common/system/persistences/entities/counsels/CounselMessages.entity";
import { CounselsEntity } from "~common/system/persistences/entities/counsels/Counsels.entity";
import { FindManyOptions, FindOptionsOrder, FindOptionsWhere } from "typeorm";

export class RepositoryCounselCriteriaMapper {
  static toFindManyOptions(criteria: CounselsCriteriaFindMany): FindManyOptions<CounselsEntity> {
    const where: FindOptionsWhere<CounselsEntity> = {};
    const order: FindOptionsOrder<CounselsEntity> = {};

    where.userId = criteria.userId.getString();

    if (isDefined(criteria.counselorId)) {
      where.counselorId = criteria.counselorId.getString();
    }

    if (criteria.orderBy) {
      order.id = criteria.orderBy.id;
    }

    return { where, order };
  }

  static toFindManyMessageOptions(criteria: CounselMessagesCriteriaFindMany): FindManyOptions<CounselMessagesEntity> {
    const where: FindOptionsWhere<CounselMessagesEntity> = {};

    where.counselId = criteria.counselId.getString();

    return { where, take: criteria.limit, skip: criteria.offset };
  }

  static toFindManyCompressedContextOptions(
    criteria: CompressedContextCriteriaFindMany,
  ): FindManyOptions<CompressedContextsEntity> {
    const where: FindOptionsWhere<CompressedContextsEntity> = {};
    where.counselId = criteria.counselId.getString();
    return { where };
  }
}
