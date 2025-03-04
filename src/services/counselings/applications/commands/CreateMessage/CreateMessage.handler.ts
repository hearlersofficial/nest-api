import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { CounselService } from "~counselings/aggregates/counsels/applications/counsel.service";
import { CreateMessageCommand, CreateMessageCommandResult } from "~counselings/applications/commands/CreateMessage/CreateMessage.command";
import { ProceedCounselingUseCase } from "~counselings/applications/useCases/ProceedCounselingUseCase/ProceedCounselingUseCase";

import { HttpStatus } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(CreateMessageCommand)
export class CreateMessageHandler implements ICommandHandler<CreateMessageCommand> {
  constructor(private readonly counselService: CounselService, private readonly proceedCounselingUseCase: ProceedCounselingUseCase) {}

  async execute(command: CreateMessageCommand): Promise<CreateMessageCommandResult> {
    const { counselId, message } = command.props;

    // 상담 정보 가져오기
    const counsel = await this.counselService.findOne(counselId);
    if (!counsel) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Counsel not found");
    }

    // 상담 진행
    const proceedCounselingResponse = await this.proceedCounselingUseCase.execute({
      counsel,
      userMessage: message,
    });
    if (!proceedCounselingResponse.ok) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, proceedCounselingResponse.error);
    }

    return {
      createdCounselMessage: proceedCounselingResponse.createdCounselMessage,
      counselorResponseMessage: proceedCounselingResponse.counselorResponseMessage,
    };
  }
}
