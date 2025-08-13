import {
  CompressedContextCriteriaFindMany,
  CounselMessagesCriteriaFindMany,
  CounselsCriteriaFindMany,
} from "~counselings/domains/counsels/counsels.criteria";
import { CounselsReader } from "~counselings/domains/counsels/counsels.reader";
import { CompressedContextsRepository } from "~counselings/domains/counsels/infrastructures/compressed-contexts.repository";
import { CounselMessagesRepository } from "~counselings/domains/counsels/infrastructures/counsel-messages.repository";
import { CounselsRepository } from "~counselings/domains/counsels/infrastructures/counsels.repository";
import { RepositoryCounselCriteriaMapper } from "~counselings/domains/counsels/infrastructures/mappers/repository-counsels-criteria.mapper";
import { CompressedContexts } from "~counselings/domains/counsels/models/compressed-context";
import { CounselMessages } from "~counselings/domains/counsels/models/counsel-messages";
import { Counsels } from "~counselings/domains/counsels/models/counsels";

import { Injectable } from "@nestjs/common";
import { CompressedContextId } from "~common/shared-kernel/identifiers/compressed-context.id";
import { CounselId } from "~common/shared-kernel/identifiers/counsel.id";
import { CounselMessageId } from "~common/shared-kernel/identifiers/counsel-message.id";

@Injectable()
export class RepositoryCounselsReader extends CounselsReader {
  constructor(
    private readonly counselsRepository: CounselsRepository,
    private readonly counselMessagesRepository: CounselMessagesRepository,
    private readonly compressedContextsRepository: CompressedContextsRepository,
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

  override async findOneCompressedContext(props: {
    compressedContextId: CompressedContextId;
  }): Promise<CompressedContexts | null> {
    return this.compressedContextsRepository.findByCompressedContextId(props.compressedContextId);
  }

  override async findManyCompressedContexts(props: CompressedContextCriteriaFindMany): Promise<CompressedContexts[]> {
    const typeormOptions = RepositoryCounselCriteriaMapper.toFindManyCompressedContextOptions(props);
    return this.compressedContextsRepository.findMany(typeormOptions);
  }
}
