import { HttpStatusBasedRpcException } from "~/src/shared/filters/exceptions";
import { GetCounselorUseCase } from "~counselings/aggregates/counselors/applications/useCases/GetCounselorUseCase/GetCounselorUseCase";
import {
  CreateCounselCommand,
  CreateCounselCommandResult,
} from "~counselings/applications/commands/CreateCounsel/CreateCounsel.command";
import { InitializeCounselUseCase } from "~counselings/applications/useCases/InitializeCounselUseCase/InitializeCounselUseCase";
import { InitializeCounselWithBubbleUseCase } from "~counselings/applications/useCases/InitializeCounselWithBubbleUseCase/InitializeCounselWithBubbleUseCase";

import { HttpStatus } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(CreateCounselCommand)
export class CreateCounselHandler implements ICommandHandler<CreateCounselCommand> {
  constructor(
    private readonly inializeCounselUseCase: InitializeCounselUseCase,
    private readonly initializeCounselWithBubbleUseCase: InitializeCounselWithBubbleUseCase,
    private readonly getCounselorUseCase: GetCounselorUseCase,
  ) {}

  async execute(command: CreateCounselCommand): Promise<CreateCounselCommandResult> {
    const { userId, counselorId, introMessage, responseMessage } = command.props;

    const counselorResult = await this.getCounselorUseCase.execute({ counselorId });
    if (!counselorResult.ok) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, counselorResult.error);
    }
    const counselor = counselorResult.counselor;

    const withBubble: boolean = introMessage && responseMessage ? true : false;
    let result: CreateCounselCommandResult;

    if (withBubble) {
      const initializeCounselWithBubbleResult = await this.initializeCounselWithBubbleUseCase.execute({
        userId,
        counselor,
        introMessage,
        responseMessage,
      });
      if (!initializeCounselWithBubbleResult.ok) {
        throw new HttpStatusBasedRpcException(
          HttpStatus.INTERNAL_SERVER_ERROR,
          initializeCounselWithBubbleResult.error,
        );
      }

      const { counsel, counselMessages } = initializeCounselWithBubbleResult;
      result = { counsel, counselMessages };
    } else {
      const initializeCounselResult = await this.inializeCounselUseCase.execute({ userId, counselor });
      if (!initializeCounselResult.ok) {
        throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, initializeCounselResult.error);
      }

      const { counsel, counselMessages } = initializeCounselResult;
      result = { counsel, counselMessages };
    }

    return result;
  }
}
