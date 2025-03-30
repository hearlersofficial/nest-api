import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { CreatedAndResponseMessages } from "~counselings/applications/types/counselMessage.type";
import { ProceedCounselingUseCase } from "~counselings/applications/use-cases/proceed-counseling";
import { CounselMessagesService } from "~counselings/domains/counselMessages/counselMessages.service";
import { CounselMessages } from "~counselings/domains/counselMessages/models/counselMessages";
import { CounselsService } from "~counselings/domains/counsels/counsels.service";
import { CounselMessageReaction } from "~proto/com/hearlers/v1/model/counsel_pb";

import { HttpStatus, Injectable } from "@nestjs/common";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class CounselMessagesFacade {
  constructor(
    private readonly counselMessagesService: CounselMessagesService,
    private readonly counselService: CounselsService,
    private readonly proceedCounselingUseCase: ProceedCounselingUseCase,
  ) {}

  @Transactional()
  async createMessage(params: { counselId: UniqueEntityId; message: string }): Promise<CreatedAndResponseMessages> {
    const { counselId, message } = params;
    const counsel = await this.counselService.getOne({ counselId });
    const proceedCounselingResult = await this.proceedCounselingUseCase.execute({
      counsel,
      userMessage: message,
    });
    if (!proceedCounselingResult.ok) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, proceedCounselingResult.error as string);
    }

    return {
      createdCounselMessage: proceedCounselingResult.createdCounselMessage,
      counselorResponseMessage: proceedCounselingResult.counselorResponseMessage,
    };
  }

  async findMessages(params: { counselId: UniqueEntityId }): Promise<CounselMessages[]> {
    const { counselId } = params;
    return this.counselMessagesService.findMany({ counselId });
  }

  @Transactional()
  async reactMessage(params: { counselMessageId: UniqueEntityId; reaction: CounselMessageReaction }) {
    const { counselMessageId, reaction } = params;
    const message = await this.counselMessagesService.getOne({ counselMessageId });
    const reactResult = message.react(reaction);
    if (reactResult.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, reactResult.error as string);
    }
    return this.counselMessagesService.update(message);
  }
}
