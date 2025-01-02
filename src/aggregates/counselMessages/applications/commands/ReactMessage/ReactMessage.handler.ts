import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ReactMessageCommand } from "./ReactMessage.command";
import { GetCounselMessageUseCase } from "../../useCases/GetCounselMessageUseCase/GetCounselMessageUseCase";
import { UpdateCounselMessageUseCase } from "../../useCases/UpdateCounselMessageUseCase/UpdateCounselMessageUseCase";
import { CounselMessages } from "../../../domain/CounselMessages";

@CommandHandler(ReactMessageCommand)
export class ReactMessageHandler implements ICommandHandler<ReactMessageCommand> {
  constructor(private readonly getCounselMessageUseCase: GetCounselMessageUseCase, private readonly updateCounselMessageUseCase: UpdateCounselMessageUseCase) {}

  async execute(command: ReactMessageCommand): Promise<CounselMessages> {
    const { messageId, reaction } = command.props;
    const getCounselMessageResult = await this.getCounselMessageUseCase.execute({ counselMessageId: messageId });
    if (!getCounselMessageResult.ok) {
      throw new Error(getCounselMessageResult.error);
    }
    const counselMessage = getCounselMessageResult.counselMessage;
    const reactResult = counselMessage.react(reaction);
    if (reactResult.isFailure) {
      throw new Error(reactResult.error);
    }
    const updateCounselMessageResult = await this.updateCounselMessageUseCase.execute({ toUpdateCounselMessage: counselMessage });
    if (!updateCounselMessageResult.ok) {
      throw new Error(updateCounselMessageResult.error);
    }

    return updateCounselMessageResult.counselMessage;
  }
}
