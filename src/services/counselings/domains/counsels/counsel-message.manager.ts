import { CounselMessagesCriteriaFindMany } from "~counselings/domains/counsels/counsel-messages.criteria";
import { CounselsReader } from "~counselings/domains/counsels/counsels.reader";
import { CounselsStore } from "~counselings/domains/counsels/counsels.store";
import { CounselMessageInfo } from "~counselings/domains/counsels/models/counsel-message.info";
import { CounselMessagesNewProps } from "~counselings/domains/counsels/models/counsel-messages";

import { Injectable } from "@nestjs/common";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class CounselMessagesService {
  constructor(
    private readonly counselsReader: CounselsReader,
    private readonly counselsStore: CounselsStore,
  ) {}

  @Transactional()
  async create(newProps: CounselMessagesNewProps): Promise<CounselMessageInfo> {
    const counselMessage = await this.counselsStore.createMessage(newProps);
    return CounselMessageInfo.fromDomain(counselMessage);
  }

  async getMany(props: CounselMessagesCriteriaFindMany): Promise<CounselMessageInfo[]> {
    const counselMessages = await this.counselsReader.findManyMessages(props);
    return counselMessages.map(CounselMessageInfo.fromDomain);
  }
}
