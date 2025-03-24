import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { CounselMessagesCriteriaFindMany } from "~counselings/domains/counselMessages/counselMessages.criteria";
import { CounselMessagesPersister } from "~counselings/domains/counselMessages/counselMessages.persister";
import { CounselMessagesReader } from "~counselings/domains/counselMessages/counselMessages.reader";
import { CounselMessages, CounselMessagesNewProps } from "~counselings/domains/counselMessages/models/counselMessages";

import { HttpStatus, Injectable } from "@nestjs/common";

@Injectable()
export class CounselMessagesService {
  constructor(private readonly counselMessagesReader: CounselMessagesReader, private readonly counselMessagesPersister: CounselMessagesPersister) {}

  async create(newProps: CounselMessagesNewProps): Promise<CounselMessages> {
    return this.counselMessagesPersister.create(newProps);
  }

  async update(counselMessage: CounselMessages): Promise<CounselMessages> {
    return this.counselMessagesPersister.update(counselMessage);
  }

  async findOne(props: { counselMessageId: UniqueEntityId }): Promise<CounselMessages | null> {
    return this.counselMessagesReader.findOne(props);
  }

  async getOne(props: { counselMessageId: UniqueEntityId }): Promise<CounselMessages> {
    const counselMessage = await this.findOne(props);
    if (!counselMessage) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Counsel message not found");
    }
    return counselMessage;
  }

  async findMany(props: CounselMessagesCriteriaFindMany): Promise<CounselMessages[]> {
    return this.counselMessagesReader.findMany(props);
  }
}
