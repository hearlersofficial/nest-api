import { CounselMessagesCriteriaFindMany } from "~counselings/domains/counselMessages/counselMessages.criteria";
import { CounselMessagesReader } from "~counselings/domains/counselMessages/counselMessages.reader";
import { CounselMessagesRepository } from "~counselings/domains/counselMessages/infrastructures/counselMessages.repository";
import { RepositoryCounselMessageCriteriaMapper } from "~counselings/domains/counselMessages/infrastructures/mappers/repository-counselMessages-criteria.mapper";
import { CounselMessages } from "~counselings/domains/counselMessages/models/counselMessages";

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
