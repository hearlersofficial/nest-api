import { CounselMessagesCriteriaFindMany } from "~counselings/domains/counselMessages/counselMessages.criteria";

import { CounselMessagesEntity } from "~common/system/persistences/entities/councels/CounselMessages.entity";
import { FindManyOptions, FindOptionsWhere } from "typeorm";

export class RepositoryCounselMessageCriteriaMapper {
  static toFindManyOptions(criteria: CounselMessagesCriteriaFindMany): FindManyOptions<CounselMessagesEntity> {
    const where: FindOptionsWhere<CounselMessagesEntity> = {};

    where.counselId = criteria.counselId.getString();

    return { where };
  }
}
