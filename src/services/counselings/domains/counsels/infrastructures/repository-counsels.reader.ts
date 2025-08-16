import {
  CompressedMessagesCriteriaFindMany,
  CounselMessagesCriteriaFindMany,
  CounselsCriteriaFindMany,
} from "~counselings/domains/counsels/counsels.criteria";
import { CounselsReader } from "~counselings/domains/counsels/counsels.reader";
import { CompressedMessagesRepository } from "~counselings/domains/counsels/infrastructures/compressed-messages.repository";
import { CounselMessagesRepository } from "~counselings/domains/counsels/infrastructures/counsel-messages.repository";
import { CounselsRepository } from "~counselings/domains/counsels/infrastructures/counsels.repository";
import { RepositoryCounselCriteriaMapper } from "~counselings/domains/counsels/infrastructures/mappers/repository-counsels-criteria.mapper";
import { CompressedMessages } from "~counselings/domains/counsels/models/compressed-messages";
import { CounselMessages } from "~counselings/domains/counsels/models/counsel-messages";
import { Counsels } from "~counselings/domains/counsels/models/counsels";

import { Injectable } from "@nestjs/common";
import { CompressedMessageId } from "~common/shared-kernel/identifiers/compressed-context.id";
import { CounselId } from "~common/shared-kernel/identifiers/counsel.id";
import { CounselMessageId } from "~common/shared-kernel/identifiers/counsel-message.id";

@Injectable()
export class RepositoryCounselsReader extends CounselsReader {
  constructor(
    private readonly counselsRepository: CounselsRepository,
    private readonly counselMessagesRepository: CounselMessagesRepository,
    private readonly compressedMessagesRepository: CompressedMessagesRepository,
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
    const typeormOptions = RepositoryCounselCriteriaMapper.toFindManyMessageOptions(props);
    return this.counselMessagesRepository.findMany(typeormOptions);
  }

  override async findOneCompressedMessage(props: {
    compressedMessageId: CompressedMessageId;
  }): Promise<CompressedMessages | null> {
    return this.compressedMessagesRepository.findById(props.compressedMessageId);
  }

  override async findManyCompressedMessages(props: CompressedMessagesCriteriaFindMany): Promise<CompressedMessages[]> {
    const typeormOptions = RepositoryCounselCriteriaMapper.toFindManyCompressedMessageOptions(props);
    return this.compressedMessagesRepository.findMany(typeormOptions);
  }
}
