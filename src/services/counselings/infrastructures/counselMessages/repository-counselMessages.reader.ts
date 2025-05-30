import { CounselMessagesCriteriaFindMany } from "~counselings/domains/counselMessages/counselMessages.criteria";
import { CounselMessagesReader } from "~counselings/domains/counselMessages/counselMessages.reader";
import { CounselMessages } from "~counselings/domains/counselMessages/models/counselMessages";
import { CounselMessagesRepository } from "~counselings/infrastructures/counselMessages/counselMessages.repository";
import { RepositoryCounselMessageCriteriaMapper } from "~counselings/infrastructures/counselMessages/mappers/repository-counselMessages-criteria.mapper";

import { Injectable } from "@nestjs/common";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";

@Injectable()
export class RepositoryCounselMessagesReader extends CounselMessagesReader {
  constructor(private readonly counselMessagesRepository: CounselMessagesRepository) {
    super();
  }

  override async findOne(props: { counselMessageId: UniqueEntityId }): Promise<CounselMessages | null> {
    return this.counselMessagesRepository.findByCounselMessageId(props.counselMessageId);
  }

  override async findMany(props: CounselMessagesCriteriaFindMany): Promise<CounselMessages[]> {
    const typeormOptions = RepositoryCounselMessageCriteriaMapper.toFindManyOptions(props);
    return this.counselMessagesRepository.findMany(typeormOptions);
  }
}
