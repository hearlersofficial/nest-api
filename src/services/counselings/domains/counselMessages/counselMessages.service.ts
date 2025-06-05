import { CounselMessagesCriteriaFindMany } from "~counselings/domains/counselMessages/counselMessages.criteria";
import { CounselMessagesPersister } from "~counselings/domains/counselMessages/counselMessages.persister";
import { CounselMessagesReader } from "~counselings/domains/counselMessages/counselMessages.reader";
import { CounselMessageInfo } from "~counselings/domains/counselMessages/models/counselMessage.info";
import { CounselMessagesNewProps } from "~counselings/domains/counselMessages/models/counselMessages";
import { CounselMessageReaction } from "~proto/com/hearlers/v1/model/counsel_pb";

import { HttpStatus, Injectable } from "@nestjs/common";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class CounselMessagesService {
  constructor(
    private readonly counselMessagesReader: CounselMessagesReader,
    private readonly counselMessagesPersister: CounselMessagesPersister,
  ) {}

  @Transactional()
  async create(newProps: CounselMessagesNewProps): Promise<CounselMessageInfo> {
    const counselMessage = await this.counselMessagesPersister.create(newProps);
    return CounselMessageInfo.fromDomain(counselMessage);
  }

  async getMany(props: CounselMessagesCriteriaFindMany): Promise<CounselMessageInfo[]> {
    const counselMessages = await this.counselMessagesReader.findMany(props);
    return counselMessages.map(CounselMessageInfo.fromDomain);
  }

  @Transactional()
  async reactMessage(props: {
    counselMessageId: UniqueEntityId;
    reaction: CounselMessageReaction;
  }): Promise<CounselMessageInfo> {
    const { counselMessageId, reaction } = props;
    const counselMessage = await this.counselMessagesReader.findOne({ counselMessageId });
    if (!counselMessage) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "CounselMessage not found");
    }

    counselMessage.react(reaction);

    const updatedCounselMessage = await this.counselMessagesPersister.update(counselMessage);
    return CounselMessageInfo.fromDomain(updatedCounselMessage);
  }
}
