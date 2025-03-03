import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { ReactMessageCommand } from "~counselings/aggregates/counselMessages/applications/commands/ReactMessage/ReactMessage.command";
import { CounselMessageService } from "~counselings/aggregates/counselMessages/applications/counselMessage.service";
import { CounselMessages } from "~counselings/aggregates/counselMessages/domain/CounselMessages";

import { HttpStatus } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(ReactMessageCommand)
export class ReactMessageHandler implements ICommandHandler<ReactMessageCommand> {
  constructor(private readonly counselMessageService: CounselMessageService) {}

  async execute(command: ReactMessageCommand): Promise<CounselMessages> {
    const { messageId, reaction } = command.props;
    const counselMessage = await this.counselMessageService.findOne(messageId);
    if (!counselMessage) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "상담 메시지를 찾을 수 없습니다.");
    }
    const reactResult = counselMessage.react(reaction);
    if (reactResult.isFailure) {
      throw new Error(reactResult.error);
    }
    const updateCounselMessage = await this.counselMessageService.update(counselMessage);

    return updateCounselMessage;
  }
}
