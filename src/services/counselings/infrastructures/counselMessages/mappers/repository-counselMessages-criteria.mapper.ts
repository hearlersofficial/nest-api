import { CounselMessagesEntity } from "~shared/core/infrastructure/entities/counsels/CounselMessages.entity";
import { CounselMessagesCriteriaFindMany } from "~counselings/domains/counselMessages/counselMessages.criteria";

import { FindManyOptions, FindOptionsWhere } from "typeorm";

export class RepositoryCounselMessageCriteriaMapper {
  static toFindManyOptions(criteria: CounselMessagesCriteriaFindMany): FindManyOptions<CounselMessagesEntity> {
    const where: FindOptionsWhere<CounselMessagesEntity> = {};

    where.counselId = criteria.counselId.getString();

    return { where };
  }
}
