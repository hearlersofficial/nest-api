import { CounselMessagesCriteriaFindMany } from "~counselings/domains/counsels/counsel-messages.criteria";
import { CounselsCriteriaFindMany } from "~counselings/domains/counsels/counsels.criteria";
import { CounselsReader } from "~counselings/domains/counsels/counsels.reader";
import { CounselMessagesRepository } from "~counselings/domains/counsels/infrastructures/counsel-messages.repository";
import { CounselsRepository } from "~counselings/domains/counsels/infrastructures/counsels.repository";
import { RepositoryCounselMessageCriteriaMapper } from "~counselings/domains/counsels/infrastructures/mappers/repository-counsel-messages-criteria.mapper";
import { RepositoryCounselCriteriaMapper } from "~counselings/domains/counsels/infrastructures/mappers/repository-counsels-criteria.mapper";
import { CounselMessages } from "~counselings/domains/counsels/models/counsel-messages";
import { Counsels } from "~counselings/domains/counsels/models/counsels";

import { Injectable } from "@nestjs/common";
import { CounselId } from "~common/shared-kernel/identifiers/counsel.id";
import { CounselMessageId } from "~common/shared-kernel/identifiers/counsel-message.id";

@Injectable()
export class RepositoryCounselsReader extends CounselsReader {
  constructor(
    private readonly counselsRepository: CounselsRepository,
    private readonly counselMessagesRepository: CounselMessagesRepository,
  ) {
    super();
  }

  override async findOne(props: { counselId: CounselId }): Promise<Counsels | null> {
    return this.counselsRepository.findByCounselId(props.counselId);
  }

  override async findMany(props: CounselsCriteriaFindMany): Promise<Counsels[]> {
    const typeormOptions = RepositoryCounselCriteriaMapper.toFindManyOptions(props);
    return this.counselsRepository.findMany(typeormOptions);
  }

  override async findOneMessage(props: { counselMessageId: CounselMessageId }): Promise<CounselMessages | null> {
    return this.counselMessagesRepository.findByCounselMessageId(props.counselMessageId);
  }

  override async findManyMessages(props: CounselMessagesCriteriaFindMany): Promise<CounselMessages[]> {
    const typeormOptions = RepositoryCounselMessageCriteriaMapper.toFindManyOptions(props);
    return this.counselMessagesRepository.findMany(typeormOptions);
  }
}
