import { CounselsStore } from "~counselings/domains/counsels/counsels.store";
import { CounselMessagesRepository } from "~counselings/domains/counsels/infrastructures/counsel-messages.repository";
import { CounselsRepository } from "~counselings/domains/counsels/infrastructures/counsels.repository";
import { CounselMessages, CounselMessagesNewProps } from "~counselings/domains/counsels/models/counsel-messages";
import { Counsels, CounselsNewProps } from "~counselings/domains/counsels/models/counsels";

import { HttpStatus, Injectable } from "@nestjs/common";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";

@Injectable()
export class RepositoryCounselsStore extends CounselsStore {
  constructor(
    private readonly counselRepository: CounselsRepository,
    private readonly counselMessagesRepository: CounselMessagesRepository,
  ) {
    super();
  }

  override async create(newProps: CounselsNewProps): Promise<Counsels> {
    const counselResult = Counsels.createNew(newProps);
    if (counselResult.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, counselResult.error as string);
    }
    return this.counselRepository.save(counselResult.value);
  }

  override async update(counsel: Counsels): Promise<Counsels> {
    return this.counselRepository.save(counsel);
  }

  override async updateMany(counsels: Counsels[]): Promise<Counsels[]> {
    return this.counselRepository.save(counsels);
  }

  override async createMessage(newProps: CounselMessagesNewProps): Promise<CounselMessages> {
    const counselMessageResult = CounselMessages.createNew(newProps);
    if (counselMessageResult.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, counselMessageResult.error as string);
    }
    return this.counselMessagesRepository.save(counselMessageResult.value);
  }

  override async updateMessage(counselMessage: CounselMessages): Promise<CounselMessages> {
    return this.counselMessagesRepository.save(counselMessage);
  }

  override async updateManyMessages(counselMessages: CounselMessages[]): Promise<CounselMessages[]> {
    return this.counselMessagesRepository.save(counselMessages);
  }
}
