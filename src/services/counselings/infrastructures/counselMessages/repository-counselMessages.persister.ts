import { CounselMessagesPersister } from "~counselings/domains/counselMessages/counselMessages.persister";
import { CounselMessages, CounselMessagesNewProps } from "~counselings/domains/counselMessages/models/counselMessages";
import { CounselMessagesRepository } from "~counselings/infrastructures/counselMessages/counselMessages.repository";

import { HttpStatus, Injectable } from "@nestjs/common";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";

@Injectable()
export class RepositoryCounselMessagesPersister extends CounselMessagesPersister {
  constructor(private readonly counselMessagesRepository: CounselMessagesRepository) {
    super();
  }

  override async create(newProps: CounselMessagesNewProps): Promise<CounselMessages> {
    const counselMessageResult = CounselMessages.createNew(newProps);
    if (counselMessageResult.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, counselMessageResult.error as string);
    }
    return this.counselMessagesRepository.save(counselMessageResult.value);
  }

  override async update(counselMessage: CounselMessages): Promise<CounselMessages> {
    return this.counselMessagesRepository.save(counselMessage);
  }

  override async updateMany(counselMessages: CounselMessages[]): Promise<CounselMessages[]> {
    return this.counselMessagesRepository.save(counselMessages);
  }
}
